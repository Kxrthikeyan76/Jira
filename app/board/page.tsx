"use client";

import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, Heading, Button, Input } from "@/components/ui";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: string | null;
  labels: string[];
  issueType: "Bug" | "Feature" | "Task";
};

type Column = { id: string; label: string };

type Board = {
  id: string;
  name: string;
  columns: Column[];
  tasks: Task[];
};

const USERS = ["User A", "User B", "User C"];
const LABELS = [
  "backend",
  "blocker",
  "bug",
  "design required",
  "duplicate",
  "enhancement",
  "front-end",
];

const BASE_COLUMNS: Column[] = [
  { id: "todo", label: "To Do" },
  { id: "inprogress", label: "In Progress" },
  { id: "inreview", label: "In Review" },
  { id: "done", label: "Done" },
];

const cloneBaseColumns = (): Column[] =>
  BASE_COLUMNS.map((c) => ({ ...c }));

export default function BoardPage() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: crypto.randomUUID(),
      name: "Main Board",
      columns: cloneBaseColumns(),
      tasks: [],
    },
  ]);

  const [activeBoardId, setActiveBoardId] = useState<string>(
    () => crypto.randomUUID() // temporary, will sync below
  );

  const [showBoardModal, setShowBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const [showAddListInput, setShowAddListInput] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);

  // ---------- TASK MODAL STATE ----------
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskColumnId, setTaskColumnId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAssignee, setTaskAssignee] = useState<string | null>(null);
  const [taskLabels, setTaskLabels] = useState<string[]>([]);
  const [taskIssueType, setTaskIssueType] =
    useState<"Bug" | "Feature" | "Task">("Task");

  // Sub popups
  const [showAssigneePopup, setShowAssigneePopup] = useState(false);
  const [showLabelPopup, setShowLabelPopup] = useState(false);
  const [showIssueTypePopup, setShowIssueTypePopup] = useState(false);

  const columnMenuRef = useRef<HTMLDivElement | null>(null);
  const metaPopupRef = useRef<HTMLDivElement | null>(null);

  // 🔥 FIX ACTIVE BOARD ON FIRST LOAD
  useEffect(() => {
    if (boards.length > 0) {
      setActiveBoardId(boards[0].id);
    }
  }, []);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  // 🔥 CLICK OUTSIDE HANDLER
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        columnMenuRef.current &&
        !columnMenuRef.current.contains(e.target as Node)
      ) {
        setOpenColumnMenu(null);
      }

      if (
        metaPopupRef.current &&
        !metaPopupRef.current.contains(e.target as Node)
      ) {
        setShowAssigneePopup(false);
        setShowLabelPopup(false);
        setShowIssueTypePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- CREATE BOARD ----------------
  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;

    const newBoard: Board = {
      id: crypto.randomUUID(),
      name: newBoardName.trim(),
      columns: cloneBaseColumns(), // 🔥 new copy
      tasks: [],
    };

    setBoards((prev) => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);

    setNewBoardName("");
    setShowBoardModal(false);
  };

  // ---------------- DELETE BOARD ----------------
  const handleDeleteBoard = (boardId: string) => {
    if (boards.length === 1) {
      alert("At least one board is required.");
      return;
    }

    if (!window.confirm("Delete this board?")) return;

    const remaining = boards.filter((b) => b.id !== boardId);
    setBoards(remaining);
    setActiveBoardId(remaining[0].id);
  };

  // ---------------- DELETE ALL LISTS ----------------
  const handleDeleteAllLists = () => {
    if (!activeBoard) return;

    if (!window.confirm("Delete ALL lists and tasks in this board?")) return;

    setBoards((prev) =>
      prev.map((b) =>
        b.id === activeBoardId
          ? { ...b, columns: [], tasks: [] }
          : b
      )
    );
  };

  // ---------------- ADD LIST ----------------
  const handleAddList = () => {
    if (!newListName.trim() || !activeBoard) return;

    const id =
      newListName.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      crypto.randomUUID();

    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              columns: [...board.columns, { id, label: newListName }],
            }
          : board
      )
    );

    setNewListName("");
    setShowAddListInput(false);
  };

  // ---------------- DELETE LIST ----------------
  const handleDeleteList = (listId: string) => {
    if (!activeBoard) return;

    if (!window.confirm("Delete this list and all its tasks?")) return;

    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              columns: board.columns.filter((c) => c.id !== listId),
              tasks: board.tasks.filter((t) => t.status !== listId),
            }
          : board
      )
    );

    setOpenColumnMenu(null);
  };

  // ---------------- OPEN TASK MODAL ----------------
  const openAddTaskModal = (columnId: string) => {
    setTaskColumnId(columnId);
    setTaskTitle("");
    setTaskDescription("");
    setTaskAssignee(null);
    setTaskLabels([]);
    setTaskIssueType("Task");

    setShowAssigneePopup(false);
    setShowLabelPopup(false);
    setShowIssueTypePopup(false);

    setShowTaskModal(true);
  };

  // ---------------- CREATE TASK ----------------
  const handleCreateTask = () => {
    if (!taskTitle.trim() || !taskColumnId || !activeBoard) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      status: taskColumnId,
      assignee: taskAssignee,
      labels: taskLabels,
      issueType: taskIssueType,
    };

    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoardId
          ? { ...board, tasks: [...board.tasks, newTask] }
          : board
      )
    );

    setShowTaskModal(false);
  };

  // ---------------- DELETE SINGLE TASK ----------------
  const handleDeleteTask = (taskId: string) => {
    if (!window.confirm("Delete this task?")) return;

    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              tasks: board.tasks.filter((task) => task.id !== taskId),
            }
          : board
      )
    );
  };

  if (!activeBoard) return null;

  return (
    <AppLayout>
      <div className="space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Heading level={1}>{activeBoard.name}</Heading>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowBoardModal(true)}>
              Create New Board
            </Button>

            <Button variant="secondary" onClick={handleDeleteAllLists}>
              Delete All Lists
            </Button>

            <Button variant="danger" onClick={() => handleDeleteBoard(activeBoard.id)}>
              Delete Board
            </Button>
          </div>
        </div>

        {/* BOARD SWITCHER */}
        <div className="flex gap-2 flex-wrap">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => setActiveBoardId(board.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition
                ${
                  board.id === activeBoardId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {board.name}
            </button>
          ))}
        </div>

        {/* ADD LIST */}
        <div className="flex justify-end">
          {showAddListInput ? (
            <div className="flex gap-2 max-w-sm">
              <Input
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
              <Button size="sm" onClick={handleAddList}>Add</Button>
              <Button size="sm" variant="secondary" onClick={() => setShowAddListInput(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <button onClick={() => setShowAddListInput(true)} className="text-sm text-blue-600 hover:underline">
              + Add a new list
            </button>
          )}
        </div>

        {/* BOARD */}
        <div className="flex gap-4 overflow-x-auto">
          {activeBoard.columns.map((column) => {
            const columnTasks = activeBoard.tasks.filter((task) => task.status === column.id);

            return (
              <div key={column.id} className="min-w-[280px] border border-gray-200 rounded-lg p-3 bg-gray-50 relative">

                {/* Column Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-semibold text-gray-700">{column.label}</div>

                  <button
                    onClick={() => setOpenColumnMenu(openColumnMenu === column.id ? null : column.id)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200"
                  >
                    ⋯
                  </button>

                  {openColumnMenu === column.id && (
                    <div
                      ref={columnMenuRef}
                      className="absolute top-9 right-2 bg-white border border-gray-200 rounded shadow-md z-10 w-44"
                    >
                      <button
                        onClick={() => handleDeleteList(column.id)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Delete list
                      </button>
                    </div>
                  )}
                </div>

                {/* Cards */}
                {columnTasks.map((task) => (
                  <Card key={task.id} className="mb-2 p-3 hover:shadow-sm transition relative">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </Card>
                ))}

                {/* ADD TASK */}
                <button
                  onClick={() => openAddTaskModal(column.id)}
                  className="mt-3 w-full text-left px-3 py-2 rounded border border-dashed border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
                >
                  + Add a new task
                </button>
              </div>
            );
          })}
        </div>

        {/* TASK MODAL */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div ref={metaPopupRef} className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg relative">

              <h2 className="text-xl font-semibold mb-4">Create new issue</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Add a title *</label>
                <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Add a description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-3 mb-6">
                <Button size="sm" variant="secondary" onClick={() => setShowAssigneePopup(!showAssigneePopup)}>
                  Assignee
                </Button>

                <Button size="sm" variant="secondary" onClick={() => setShowLabelPopup(!showLabelPopup)}>
                  Label
                </Button>

                <Button size="sm" variant="secondary" onClick={() => setShowIssueTypePopup(!showIssueTypePopup)}>
                  Issue type
                </Button>
              </div>

              {/* ASSIGNEE POPUP */}
              {showAssigneePopup && (
                <div className="absolute left-6 top-[350px] bg-white border border-gray-200 rounded shadow-lg p-3 w-64 z-10">
                  <p className="text-sm font-medium mb-2">Select assignee</p>
                  {USERS.map((user) => (
                    <button
                      key={user}
                      onClick={() => {
                        setTaskAssignee(user);
                        setShowAssigneePopup(false);
                      }}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {user}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setTaskAssignee(null);
                      setShowAssigneePopup(false);
                    }}
                    className="w-full text-left px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded"
                  >
                    Unassigned
                  </button>
                </div>
              )}

              {/* LABEL POPUP */}
              {showLabelPopup && (
                <div className="absolute left-28 top-[350px] bg-white border border-gray-200 rounded shadow-lg p-3 w-64 z-10">
                  <p className="text-sm font-medium mb-2">Apply labels</p>
                  {LABELS.map((label) => (
                    <label key={label} className="flex items-center gap-2 mb-1 text-sm">
                      <input
                        type="checkbox"
                        checked={taskLabels.includes(label)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTaskLabels((prev) => [...prev, label]);
                          } else {
                            setTaskLabels((prev) => prev.filter((l) => l !== label));
                          }
                        }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}

              {/* ISSUE TYPE POPUP */}
              {showIssueTypePopup && (
                <div className="absolute left-56 top-[350px] bg-white border border-gray-200 rounded shadow-lg p-3 w-64 z-10">
                  <p className="text-sm font-medium mb-2">Select issue type</p>
                  {["Bug", "Feature", "Task"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setTaskIssueType(type as any);
                        setShowIssueTypePopup(false);
                      }}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}

              {/* FOOTER */}
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>Create</Button>
              </div>

            </div>
          </div>
        )}

        {/* CREATE BOARD MODAL */}
        {showBoardModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Create New Board</h2>

              <Input
                placeholder="Board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="mb-4"
              />

              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setShowBoardModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBoard}>Create Board</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
