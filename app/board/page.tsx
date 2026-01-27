// BoardPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, Heading, Button, Input } from "@/components/ui";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiMoreVertical,
  FiUser,
  FiTag,
  FiAlertCircle,
  FiCheckCircle,
  FiFolder,
  FiLogOut,
  FiGrid,
  FiBarChart2,
  FiClipboard,
  FiCalendar,
  FiCheckSquare,
  FiArchive,
  FiX
} from "react-icons/fi";

/* ---------------- ENHANCED TYPES ---------------- */
type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: string | null;
  labels: string[];
  issueType: "Bug" | "Feature" | "Task";
  createdAt: string;
  updatedAt: string;
};

type Column = { 
  id: string; 
  label: string;
  wipLimit?: number;
};

type Board = {
  id: string;
  name: string;
  columns: Column[];
  tasks: Task[];
  userId: string;
  userName: string;
  description?: string;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: "user" | "admin";
};

const LABELS = [
  "backend",
  "blocker",
  "bug",
  "design required",
  "duplicate",
  "enhancement",
  "front-end",
  "urgent",
  "low priority",
  "testing",
];

const BASE_COLUMNS: Column[] = [
  { id: "todo", label: "To Do", wipLimit: null },
  { id: "inprogress", label: "In Progress", wipLimit: 5 },
  { id: "inreview", label: "In Review", wipLimit: 3 },
  { id: "done", label: "Done", wipLimit: null },
];

const cloneBaseColumns = (): Column[] => BASE_COLUMNS.map((c) => ({ ...c }));

// Single logged in user
const LOGGED_IN_USER: User = {
  id: "1",
  name: "Dharsan",
  email: "dharsan1102@gmail.com",
  role: "user"
};

// Default boards with tasks assigned to the logged in user
const DEFAULT_BOARDS: Board[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "",
    columns: cloneBaseColumns(),
    tasks: [
      {
        id: "task-1",
        title: "Update homepage layout",
        description: "Redesign the homepage with new components and improve user experience",
        status: "inprogress",
        assignee: "Dharsan",
        labels: ["front-end", "design required", "urgent"],
        issueType: "Feature",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20"
      },
      {
        id: "task-2",
        title: "Fix mobile navigation",
        description: "Navigation menu breaks on mobile devices with iOS Safari",
        status: "todo",
        assignee: "Dharsan",
        labels: ["bug", "front-end", "urgent"],
        issueType: "Bug",
        createdAt: "2024-01-18",
        updatedAt: "2024-01-18"
      },
      {
        id: "task-3",
        title: "Optimize image loading",
        description: "Implement lazy loading for images to improve page speed",
        status: "inreview",
        assignee: "Dharsan",
        labels: ["front-end", "enhancement"],
        issueType: "Feature",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-19"
      }
    ],
    userId: "1",
    userName: "Dharsan",
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "API Development",
    description: "",
    columns: cloneBaseColumns(),
    tasks: [
      {
        id: "task-4",
        title: "Create authentication endpoint",
        description: "Implement JWT-based authentication with refresh tokens",
        status: "done",
        assignee: "Dharsan",
        labels: ["backend"],
        issueType: "Task",
        createdAt: "2024-01-05",
        updatedAt: "2024-01-12"
      },
      {
        id: "task-5",
        title: "Database optimization",
        description: "Optimize queries and add indexes for better performance",
        status: "inprogress",
        assignee: "Dharsan",
        labels: ["backend", "enhancement"],
        issueType: "Feature",
        createdAt: "2024-01-14",
        updatedAt: "2024-01-20"
      }
    ],
    userId: "1",
    userName: "Dharsan",
    createdAt: "2024-01-02"
  },
  {
    id: "3",
    name: "Mobile App Launch",
    description: "",
    columns: cloneBaseColumns(),
    tasks: [
      {
        id: "task-6",
        title: "App store submission",
        description: "Prepare and submit app to Apple App Store and Google Play",
        status: "todo",
        assignee: "Dharsan",
        labels: ["blocker", "urgent"],
        issueType: "Task",
        createdAt: "2024-01-20",
        updatedAt: "2024-01-20"
      }
    ],
    userId: "1",
    userName: "Dharsan",
    createdAt: "2024-01-03"
  }
];

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-300 text-red-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800'
  }[type];

  const icon = {
    success: <FiCheckCircle className="text-green-600" />,
    error: <FiAlertCircle className="text-red-600" />,
    info: <FiAlertCircle className="text-blue-600" />
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border ${bgColor} shadow-lg flex items-center gap-2 animate-slideIn`}>
      <span>{icon}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
        <FiX />
      </button>
    </div>
  );
};

// Confirmation modal component
const ConfirmationModal = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger"
}: { 
  title: string; 
  message: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}) => {
  const bgColor = {
    danger: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }[type];

  const buttonColor = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  }[type];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl p-6 w-full max-w-md shadow-lg border ${bgColor}`}>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={buttonColor}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function BoardPage() {
  // ---------- USER STATE ----------
  const [currentUser, setCurrentUser] = useState<User>(LOGGED_IN_USER);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // ---------- BOARD STATES ----------
  const [boards, setBoards] = useState<Board[]>(DEFAULT_BOARDS);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'projects' | 'board'>('projects');

  const [showBoardModal, setShowBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");

  const [showRenameBoardModal, setShowRenameBoardModal] = useState(false);
  const [renameBoardValue, setRenameBoardValue] = useState("");

  const [showAddListInput, setShowAddListInput] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);

  const [showRenameListModal, setShowRenameListModal] = useState(false);
  const [renameListValue, setRenameListValue] = useState("");
  const [renameListId, setRenameListId] = useState<string | null>(null);

  // ---------- TASK MODAL STATE ----------
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskColumnId, setTaskColumnId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAssignee, setTaskAssignee] = useState<string | null>(null);
  const [taskLabels, setTaskLabels] = useState<string[]>([]);
  const [taskIssueType, setTaskIssueType] = useState<
    "Bug" | "Feature" | "Task"
  >("Task");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [showAssigneePopup, setShowAssigneePopup] = useState(false);
  const [showLabelPopup, setShowLabelPopup] = useState(false);
  const [showIssueTypePopup, setShowIssueTypePopup] = useState(false);

  // ---------- NOTIFICATION & CONFIRMATION STATES ----------
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "danger" | "warning" | "info";
    confirmText?: string;
  } | null>(null);

  // ---------- DRAG AND DROP STATE ----------
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const [isDraggingTask, setIsDraggingTask] = useState(false);

  const columnMenuRef = useRef<HTMLDivElement | null>(null);
  const assigneePopupRef = useRef<HTMLDivElement | null>(null);
  const labelPopupRef = useRef<HTMLDivElement | null>(null);
  const issueTypePopupRef = useRef<HTMLDivElement | null>(null);
  const boardScrollRef = useRef<HTMLDivElement | null>(null);
  const bottomScrollRef = useRef<HTMLDivElement | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    // Auto-select first board with user's tasks when in projects view
    if (viewMode === 'projects' && boards.length > 0) {
      const boardWithUserTasks = boards.find(board => 
        board.tasks.some(task => task.assignee === currentUser.name)
      );
      if (boardWithUserTasks) {
        setActiveBoardId(boardWithUserTasks.id);
      }
    }
  }, [viewMode, boards, currentUser]);

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  
  // Get tasks assigned to current user across all boards
  const getAssignedTasks = () => {
    return boards.flatMap(board => 
      board.tasks
        .filter(task => task.assignee === currentUser.name)
        .map(task => ({
          ...task,
          boardName: board.name,
          boardId: board.id
        }))
    );
  };

  // Get boards where current user has tasks
  const getAssignedBoards = () => {
    return boards.filter(board => 
      board.tasks.some(task => task.assignee === currentUser.name)
    );
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Show confirmation modal
  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    type?: "danger" | "warning" | "info",
    confirmText?: string
  ) => {
    setConfirmationModal({
      title,
      message,
      onConfirm,
      type,
      confirmText
    });
  };

  // click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        columnMenuRef.current &&
        !columnMenuRef.current.contains(e.target as Node)
      ) {
        setOpenColumnMenu(null);
      }

      if (
        showAssigneePopup &&
        assigneePopupRef.current &&
        !assigneePopupRef.current.contains(e.target as Node)
      ) {
        setShowAssigneePopup(false);
      }

      if (
        showLabelPopup &&
        labelPopupRef.current &&
        !labelPopupRef.current.contains(e.target as Node)
      ) {
        setShowLabelPopup(false);
      }

      if (
        showIssueTypePopup &&
        issueTypePopupRef.current &&
        !issueTypePopupRef.current.contains(e.target as Node)
      ) {
        setShowIssueTypePopup(false);
      }

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAssigneePopup, showLabelPopup, showIssueTypePopup, showProfileDropdown]);

  useEffect(() => {
    const boardEl = boardScrollRef.current;
    const bottomEl = bottomScrollRef.current;

    if (!boardEl || !bottomEl) return;

    const syncFromBoard = () => {
      bottomEl.scrollLeft = boardEl.scrollLeft;
    };

    const syncFromBottom = () => {
      boardEl.scrollLeft = bottomEl.scrollLeft;
    };

    boardEl.addEventListener("scroll", syncFromBoard);
    bottomEl.addEventListener("scroll", syncFromBottom);

    return () => {
      boardEl.removeEventListener("scroll", syncFromBoard);
      bottomEl.removeEventListener("scroll", syncFromBottom);
    };
  }, []);

  /* ---------------- BOARD MANAGEMENT ---------------- */
  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;

    const newBoard: Board = {
      id: crypto.randomUUID(),
      name: newBoardName.trim(),
      description: newBoardDescription.trim(),
      columns: cloneBaseColumns(),
      tasks: [],
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    setBoards((prev) => [...prev, newBoard]);
    setNewBoardName("");
    setNewBoardDescription("");
    setShowBoardModal(false);
    setActiveBoardId(newBoard.id);
    setViewMode('board');
    showToast(`Project "${newBoardName.trim()}" created successfully!`);
  };

  const handleRenameBoard = () => {
    if (!renameBoardValue.trim() || !activeBoard) return;

    const oldName = activeBoard.name;
    setBoards((prev) =>
      prev.map((b) =>
        b.id === activeBoardId ? { ...b, name: renameBoardValue.trim() } : b
      )
    );

    setShowRenameBoardModal(false);
    setRenameBoardValue("");
    showToast(`Project renamed from "${oldName}" to "${renameBoardValue.trim()}"`);
  };

  const handleDeleteBoard = (boardId: string) => {
    const boardToDelete = boards.find(b => b.id === boardId);
    if (!boardToDelete) return;

    showConfirmation(
      "Delete Project",
      `Are you sure you want to delete "${boardToDelete.name}"? This will delete all tasks and lists in this project.`,
      () => {
        setBoards((prev) => prev.filter((b) => b.id !== boardId));
        
        // If deleting active board, go back to projects view
        if (boardId === activeBoardId) {
          setActiveBoardId(null);
          setViewMode('projects');
        }
        
        showToast(`Project "${boardToDelete.name}" deleted successfully!`);
      },
      "danger"
    );
  };

  const handleDeleteAllLists = () => {
    if (!activeBoard) return;

    showConfirmation(
      "Delete All Lists",
      `Are you sure you want to delete ALL lists and tasks in "${activeBoard.name}"? This action cannot be undone.`,
      () => {
        setBoards((prev) =>
          prev.map((b) =>
            b.id === activeBoardId ? { ...b, columns: [], tasks: [] } : b
          )
        );
        showToast(`All lists and tasks deleted from "${activeBoard.name}"`);
      },
      "danger"
    );
  };

  /* ---------------- LIST MANAGEMENT ---------------- */
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
              columns: [...board.columns, { id, label: newListName, wipLimit: undefined }],
            }
          : board
      )
    );

    setNewListName("");
    setShowAddListInput(false);
    showToast(`List "${newListName}" added successfully!`);
  };

  const handleRenameList = () => {
    if (!renameListValue.trim() || !renameListId || !activeBoard) return;

    const column = activeBoard.columns.find(c => c.id === renameListId);
    if (!column) return;

    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              columns: board.columns.map((c) =>
                c.id === renameListId
                  ? { ...c, label: renameListValue.trim() }
                  : c
              ),
            }
          : board
      )
    );

    setShowRenameListModal(false);
    setRenameListValue("");
    setRenameListId(null);
    showToast(`List renamed to "${renameListValue.trim()}"`);
  };

  const handleDeleteList = (listId: string) => {
    if (!activeBoard) return;
    
    const column = activeBoard.columns.find(c => c.id === listId);
    if (!column) return;

    const taskCount = activeBoard.tasks.filter(t => t.status === listId).length;

    showConfirmation(
      "Delete List",
      `Are you sure you want to delete "${column.label}"? This will delete ${taskCount} task${taskCount !== 1 ? 's' : ''}.`,
      () => {
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
        showToast(`List "${column.label}" deleted successfully!`);
      },
      "danger"
    );
  };

  /* ---------------- TASK MANAGEMENT ---------------- */
  const openAddTaskModal = (columnId: string) => {
    setEditingTaskId(null);
    setTaskColumnId(columnId);
    setTaskTitle("");
    setTaskDescription("");
    setTaskAssignee(currentUser.name);
    setTaskLabels([]);
    setTaskIssueType("Task");

    setShowAssigneePopup(false);
    setShowLabelPopup(false);
    setShowIssueTypePopup(false);

    setShowTaskModal(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskColumnId(task.status);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskAssignee(task.assignee);
    setTaskLabels(task.labels);
    setTaskIssueType(task.issueType);

    setShowTaskModal(true);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim() || !taskColumnId || !activeBoard) return;

    if (editingTaskId) {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === activeBoardId
            ? {
                ...board,
                tasks: board.tasks.map((t) =>
                  t.id === editingTaskId
                    ? {
                        ...t,
                        title: taskTitle.trim(),
                        description: taskDescription.trim(),
                        assignee: taskAssignee,
                        labels: taskLabels,
                        issueType: taskIssueType,
                        updatedAt: new Date().toISOString()
                      }
                    : t
                ),
              }
            : board
        )
      );
      showToast(`Task "${taskTitle.trim()}" updated successfully!`);
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        status: taskColumnId,
        assignee: taskAssignee,
        labels: taskLabels,
        issueType: taskIssueType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setBoards((prev) =>
        prev.map((board) =>
          board.id === activeBoardId
            ? { ...board, tasks: [...board.tasks, newTask] }
            : board
        )
      );
      showToast(`Task "${taskTitle.trim()}" created successfully!`);
    }

    setShowTaskModal(false);
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = activeBoard?.tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    showConfirmation(
      "Delete Task",
      `Are you sure you want to delete "${taskToDelete.title}"?`,
      () => {
        setBoards((prev) =>
          prev.map((board) =>
            board.id === activeBoardId
              ? {
                  ...board,
                  tasks: board.tasks.filter((t) => t.id !== taskId),
                }
              : board
          )
        );
        showToast(`Task "${taskToDelete.title}" deleted successfully!`);
      },
      "danger"
    );
  };

  /* ---------------- DRAG AND DROP ---------------- */
  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    e.stopPropagation();
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("sourceColumn", task.status);
    e.dataTransfer.effectAllowed = "move";
    setDraggedTask(task);
    setIsDraggingTask(true);
    
    const element = e.currentTarget as HTMLElement;
    element.classList.add("opacity-50");
  };

  const handleTaskDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    const element = e.currentTarget as HTMLElement;
    element.classList.remove("opacity-50");
    setDraggedTask(null);
    setDragOverColumn(null);
    setIsDraggingTask(false);
  };

  const handleTaskDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleTaskDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleTaskDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumn");
    
    if (!taskId || !sourceColumnId || !activeBoard) return;
    
    if (sourceColumnId === targetColumnId) {
      setDragOverColumn(null);
      return;
    }
    
    const task = activeBoard.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoardId
          ? {
              ...board,
              tasks: board.tasks.map((task) =>
                task.id === taskId
                  ? { 
                    ...task, 
                    status: targetColumnId,
                    updatedAt: new Date().toISOString()
                  }
                  : task
              ),
            }
          : board
      )
    );
    
    setDragOverColumn(null);
    
    // Show notification for task movement
    const sourceColumn = activeBoard.columns.find(c => c.id === sourceColumnId);
    const targetColumn = activeBoard.columns.find(c => c.id === targetColumnId);
    if (sourceColumn && targetColumn) {
      showToast(`Task "${task.title}" moved from ${sourceColumn.label} to ${targetColumn.label}`, 'info');
    }
  };

  const handleColumnDragStart = (e: React.DragEvent, column: Column) => {
    if ((e.target as HTMLElement).closest('[draggable="true"]:not(.column-header)')) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.setData("columnId", column.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedColumn(column);
    setIsDraggingColumn(true);
    
    const columnElement = e.currentTarget.closest('.column-container') as HTMLElement;
    if (columnElement) {
      columnElement.classList.add("opacity-50");
    }
  };

  const handleColumnDragEnd = (e: React.DragEvent) => {
    const columnElement = e.currentTarget.closest('.column-container') as HTMLElement;
    if (columnElement) {
      columnElement.classList.remove("opacity-50");
    }
    setDraggedColumn(null);
    setIsDraggingColumn(false);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) return;
    
    const draggedColumnId = e.dataTransfer.getData("columnId");
    
    if (!draggedColumnId || !activeBoard || draggedColumnId === targetColumnId) return;
    
    const currentColumns = [...activeBoard.columns];
    const draggedIndex = currentColumns.findIndex(c => c.id === draggedColumnId);
    const targetIndex = currentColumns.findIndex(c => c.id === targetColumnId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const [removed] = currentColumns.splice(draggedIndex, 1);
    currentColumns.splice(targetIndex, 0, removed);
    
    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoardId
          ? { ...board, columns: currentColumns }
          : board
      )
    );
    
    const draggedColumn = activeBoard.columns.find(c => c.id === draggedColumnId);
    const targetColumn = activeBoard.columns.find(c => c.id === targetColumnId);
    if (draggedColumn && targetColumn) {
      showToast(`Column "${draggedColumn.label}" moved`, 'info');
    }
  };

  /* ---------------- USER PROFILE DROPDOWN ---------------- */
  const renderProfileDropdown = () => {
    const assignedTasks = getAssignedTasks();
    const assignedBoards = getAssignedBoards();

    return (
      <div className="relative" ref={profileDropdownRef}>
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition-colors"
          title="Profile"
        >
          {currentUser.name.charAt(0).toUpperCase()}
        </button>

        {showProfileDropdown && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{currentUser.name}</h3>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role} account</p>
                </div>
              </div>
            </div>

            {/* My Projects Section */}
            <div className="p-3 border-b max-h-64 overflow-y-auto">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                <FiFolder className="text-gray-500" />
                <span>My Projects</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {assignedBoards.length}
                </span>
              </h4>
              
              {assignedBoards.length === 0 ? (
                <p className="text-sm text-gray-500 p-2">No projects assigned</p>
              ) : (
                <div className="space-y-1">
                  {assignedBoards.map((board) => {
                    const boardTasks = assignedTasks.filter(t => t.boardId === board.id);
                    const completedTasks = boardTasks.filter(t => t.status === 'done').length;
                    return (
                      <button
                        key={board.id}
                        onClick={() => {
                          setActiveBoardId(board.id);
                          setViewMode('board');
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-sm transition-colors hover:bg-blue-50 ${
                          board.id === activeBoardId ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{board.name}</span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                            {boardTasks.length} tasks
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <FiUser className="text-gray-400" />
                          <span>{board.userName}</span>
                          <span>•</span>
                          <FiCheckSquare className="text-gray-400" />
                          <span>{completedTasks} done</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="p-3 border-b">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                <FiBarChart2 className="text-gray-500" />
                <span>Quick Stats</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Total Tasks', value: assignedTasks.length, color: 'text-blue-600', icon: <FiClipboard className="text-blue-500" /> },
                  { label: 'In Progress', value: assignedTasks.filter(t => t.status === 'inprogress').length, color: 'text-yellow-600', icon: <FiAlertCircle className="text-yellow-500" /> },
                  { label: 'Pending Review', value: assignedTasks.filter(t => t.status === 'inreview').length, color: 'text-purple-600', icon: <FiAlertCircle className="text-purple-500" /> },
                  { label: 'Completed', value: assignedTasks.filter(t => t.status === 'done').length, color: 'text-green-600', icon: <FiCheckCircle className="text-green-500" /> },
                ].map((stat, index) => (
                  <div key={index} className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {stat.icon}
                      <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-3">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setViewMode('projects');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiGrid className="text-gray-500" />
                  View All Projects
                </button>
                <button
                  onClick={() => {
                    setShowBoardModal(true);
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiPlus className="text-gray-500" />
                  Create New Project
                </button>
                <button
                  onClick={() => {
                    showToast("Logged out successfully!");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiLogOut className="text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ---------------- PROJECTS VIEW ---------------- */
  const renderProjectsView = () => {
    const assignedBoards = getAssignedBoards();

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Heading level={1}>My Projects</Heading>
            <p className="text-gray-600 mt-1">
              Welcome back, {currentUser.name}! Here are your assigned projects.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowBoardModal(true)}>
              <FiPlus className="mr-2" />
              Create New Project
            </Button>
            {/* Profile moved to right of Create New Project button */}
            {renderProfileDropdown()}
          </div>
        </div>

        {assignedBoards.length === 0 ? (
          <Card className="p-8 text-center">
            <FiFolder className="text-gray-400 mb-4 text-4xl mx-auto" />
            <h3 className="text-lg font-semibold mb-2">No Projects Assigned</h3>
            <p className="text-gray-600 mb-4">
              You don't have any projects assigned yet. Create your first project to get started.
            </p>
            <Button onClick={() => setShowBoardModal(true)}>
              Create Your First Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedBoards.map((board) => (
              <Card key={board.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => {
                  setActiveBoardId(board.id);
                  setViewMode('board');
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-3">{board.name}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm p-1"
                    title="Delete project"
                  >
                    <FiX />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBoardId(board.id);
                      setViewMode('board');
                    }}
                  >
                    Open Board
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ---------------- BOARD VIEW ---------------- */
  const renderBoardView = () => {
    if (!activeBoard) {
      setViewMode('projects');
      return null;
    }

    return (
      <div className="space-y-2 min-h-screen bg-white w-full max-w-full overflow-x-hidden pb-2 flex flex-col overflow-y-hidden">
        {/* HEADER - Reduced top and left space */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            {/* Back button - Arrow only, no text */}
            <button
              onClick={() => setViewMode('projects')}
              className="flex items-center text-gray-700 hover:text-gray-900 group"
            >
              <div className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 hover:border-gray-400 bg-white group-hover:bg-gray-50 transition-colors mr-2">
                <FiArrowLeft className="text-gray-500 group-hover:text-gray-700 text-sm" />
              </div>
            </button>
            
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{activeBoard.name}</h1>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                  {activeBoard.userName.charAt(0).toUpperCase()}
                </div>
                <span>{activeBoard.userName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setRenameBoardValue(activeBoard.name);
                setShowRenameBoardModal(true);
              }}
              size="sm"
            >
              Rename
            </Button>

            <Button 
              variant="secondary" 
              onClick={handleDeleteAllLists}
              size="sm"
            >
              Clear All
            </Button>

            <Button
              variant="danger"
              onClick={() => handleDeleteBoard(activeBoard.id)}
              size="sm"
            >
              Delete
            </Button>
            
            {renderProfileDropdown()}
          </div>
        </div>

        {/* BOARD CONTROLS - Reduced space */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span>{activeBoard.tasks.filter(t => t.assignee === currentUser.name).length} tasks</span>
          </div>
          {showAddListInput ? (
            <div className="flex gap-2">
              <Input
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-40"
                autoFocus
              />
              <Button size="sm" onClick={handleAddList}>
                Add
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAddListInput(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddListInput(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              title="Add a new list"
            >
              <FiPlus className="text-gray-400 group-hover:text-blue-500 text-lg" />
            </button>
          )}
        </div>

        {/* BOARD WITH DRAG AND DROP - Fixed height container */}
        <div className="relative w-full flex-1 min-h-[calc(100vh-160px)]">
          <div
            ref={boardScrollRef}
            className="w-full h-full overflow-x-auto  pb-3"
          >
            <div
              className="flex gap-4 h-full"
              style={{ width: "max-content", minWidth: "100%" }}
            >
              {activeBoard.columns.map((column, columnIndex) => {
                const columnTasks = activeBoard.tasks.filter(
                  (task) => task.status === column.id
                );

                return (
                  <div key={column.id} className="flex items-start h-full">
                    {/* COLUMN CONTAINER - Fixed height with internal scroll */}
                    <div
                      className={`column-container w-64 flex-shrink-0 border border-gray-200 rounded-lg p-2 bg-gray-50 relative h-full min-h-[500px] max-h-[calc(100vh-180px)] flex flex-col transition-all duration-200 ${
                        dragOverColumn === column.id && isDraggingTask
                          ? "border-2 border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      {/* Column Header */}
                      <div 
                        className="column-header mb-2 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
                        draggable
                        onDragStart={(e) => handleColumnDragStart(e, column)}
                        onDragEnd={handleColumnDragEnd}
                        onDragOver={handleColumnDragOver}
                        onDrop={(e) => handleColumnDrop(e, column.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700 text-sm">
                            {column.label}
                          </span>
                          <span className="text-xs font-bold bg-blue-600 text-white rounded-full px-2 py-0.5">
                            {columnTasks.length}
                          </span>
                          {column.wipLimit && (
                            <span className="text-xs font-medium text-gray-500">
                              WIP: {columnTasks.length}/{column.wipLimit}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* ADD TASK BUTTON */}
                          <button
                            onClick={() => openAddTaskModal(column.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            title="Add a new task"
                          >
                            <FiPlus className="text-gray-400 hover:text-blue-500 text-sm" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenColumnMenu(
                                openColumnMenu === column.id ? null : column.id
                              );
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200"
                            title="Column options"
                          >
                            <FiMoreVertical size={14} />
                          </button>
                        </div>

                        {openColumnMenu === column.id && (
                          <div
                            ref={columnMenuRef}
                            className="absolute top-8 right-2 bg-white border border-gray-200 rounded shadow-md z-10 w-44"
                          >
                            <button
                              onClick={() => {
                                setRenameListId(column.id);
                                setRenameListValue(column.label);
                                setShowRenameListModal(true);
                                setOpenColumnMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                              <FiEdit2 className="text-gray-500" size={14} />
                              Rename list
                            </button>
                            <button
                              onClick={() => handleDeleteList(column.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <FiTrash2 className="text-red-500" size={14} />
                              Delete list
                            </button>
                          </div>
                        )}
                      </div>

                      {/* TASKS CONTAINER - Scrollable area with fixed height */}
                      <div
                        className="flex-grow overflow-y-auto space-y-2 pr-1"
                        onDragOver={(e) => handleTaskDragOver(e, column.id)}
                        onDragLeave={handleTaskDragLeave}
                        onDrop={(e) => handleTaskDrop(e, column.id)}
                        style={{ maxHeight: 'calc(100% - 50px)' }}
                      >
                        {columnTasks.length === 0 && dragOverColumn === column.id && isDraggingTask && (
                          <div className="h-32 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm mb-2">
                            Drop task here
                          </div>
                        )}

                        {columnTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleTaskDragStart(e, task)}
                            onDragEnd={handleTaskDragEnd}
                            className="cursor-move task-card"
                          >
                            <Card
                              className={`p-2 hover:shadow-md transition-all duration-200 bg-white ${
                                task.assignee === currentUser.name ? 'border-l-3 border-blue-500' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <p
                                  onClick={() => openEditTaskModal(task)}
                                  className="text-xs font-medium text-gray-900 cursor-pointer hover:text-blue-600 flex-1 line-clamp-2"
                                >
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {task.assignee === currentUser.name && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                      Me
                                    </span>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditTaskModal(task);
                                    }}
                                    className="text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-0.5 rounded"
                                    title="Edit task"
                                  >
                                    <FiEdit2 size={12} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTask(task.id);
                                    }}
                                    className="text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 p-0.5 rounded"
                                    title="Delete task"
                                  >
                                    <FiX size={12} />
                                  </button>
                                </div>
                              </div>

                              {/* Task metadata - reduced spacing */}
                              <div className="mt-1 space-y-1">
                                {/* Issue Type Badge - smaller */}
                                <div className="flex items-center gap-1">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                    task.issueType === "Bug" 
                                      ? "bg-red-50 text-red-700 border border-red-200"
                                      : task.issueType === "Feature"
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : "bg-gray-50 text-gray-700 border border-gray-200"
                                  }`}>
                                    {task.issueType === "Bug" && <FiAlertCircle className="mr-0.5" size={10} />}
                                    {task.issueType === "Feature" && <FiPlus className="mr-0.5" size={10} />}
                                    {task.issueType === "Task" && <FiCheckSquare className="mr-0.5" size={10} />}
                                    <span className="text-xs">{task.issueType}</span>
                                  </span>
                                </div>

                                {/* Labels - smaller */}
                                {task.labels.length > 0 && (
                                  <div className="flex flex-wrap gap-0.5">
                                    {task.labels.slice(0, 2).map((label) => (
                                      <span
                                        key={label}
                                        className="bg-gray-50 px-1.5 py-0.5 rounded text-xs text-gray-700 border border-gray-200 flex items-center gap-0.5"
                                      >
                                        <FiTag className="text-gray-400" size={10} />
                                        <span className="text-xs">{label}</span>
                                      </span>
                                    ))}
                                    {task.labels.length > 2 && (
                                      <span className="text-xs text-gray-500">
                                        +{task.labels.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Last updated - smaller */}
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <FiCalendar className="text-gray-400" size={10} />
                                  <span>{new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      
      </div>
    );
  };

  /* ---------------- RENDER MODALS ---------------- */
  const renderModals = () => (
    <>
      {/* TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {editingTaskId ? "Edit issue" : "Create new issue"}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Add a title *
              </label>
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Add a description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Describe the task in detail..."
              />
            </div>

            {/* META ACTION ROW */}
            <div className="mb-6 space-y-4">
              {/* Action Buttons Row */}
              <div className="flex items-center gap-4 pt-4 border-t">
                {/* ASSIGNEE BUTTON */}
                <div className="relative">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setShowAssigneePopup((prev) => !prev);
                      setShowLabelPopup(false);
                      setShowIssueTypePopup(false);
                    }}
                    className={`px-4 py-2 flex items-center gap-2 ${
                      taskAssignee ? "bg-blue-100 text-blue-700 border-blue-200" : ""
                    }`}
                  >
                    <FiUser />
                    {taskAssignee ? "Change Assignee" : "Assign"}
                  </Button>

                  {showAssigneePopup && (
                    <div
                      ref={assigneePopupRef}
                      className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 z-20"
                    >
                      <p className="text-sm font-medium mb-2 text-gray-700">
                        Select assignee
                      </p>
                      <button
                        onClick={() => {
                          setTaskAssignee(currentUser.name);
                          setShowAssigneePopup(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2 transition-colors"
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{currentUser.name} (You)</span>
                      </button>
                      {taskAssignee && (
                        <button
                          onClick={() => {
                            setTaskAssignee(null);
                            setShowAssigneePopup(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-2 border-t pt-2 flex items-center gap-2"
                        >
                          <FiX />
                          Clear assignee
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* LABEL BUTTON */}
                <div className="relative">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setShowLabelPopup((prev) => !prev);
                      setShowAssigneePopup(false);
                      setShowIssueTypePopup(false);
                    }}
                    className={`px-4 py-2 flex items-center gap-2 ${
                      taskLabels.length > 0 ? "bg-blue-100 text-blue-700 border-blue-200" : ""
                    }`}
                  >
                    <FiTag />
                    {taskLabels.length > 0 ? `Labels (${taskLabels.length})` : "Label"}
                  </Button>

                  {showLabelPopup && (
                    <div
                      ref={labelPopupRef}
                      className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 z-20 max-h-80 overflow-y-auto"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">Apply labels</p>
                        {taskLabels.length > 0 && (
                          <button
                            onClick={() => setTaskLabels([])}
                            className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1"
                          >
                            <FiX />
                            Clear all
                          </button>
                        )}
                      </div>
                      {LABELS.map((label) => (
                        <label
                          key={label}
                          className="flex items-center gap-3 mb-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={taskLabels.includes(label)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTaskLabels((prev) => [...prev, label]);
                                } else {
                                  setTaskLabels((prev) =>
                                    prev.filter((l) => l !== label)
                                  );
                                }
                              }}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                          </div>
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* ISSUE TYPE BUTTON */}
                <div className="relative">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setShowIssueTypePopup((prev) => !prev);
                      setShowAssigneePopup(false);
                      setShowLabelPopup(false);
                    }}
                    className={`px-4 py-2 flex items-center gap-2 ${
                      taskIssueType !== "Task" 
                        ? taskIssueType === "Bug" 
                          ? "bg-red-100 text-red-700 border-red-200"
                          : taskIssueType === "Feature"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : ""
                        : ""
                    }`}
                  >
                    {taskIssueType === "Bug" ? <FiAlertCircle className="text-red-600" /> :
                     taskIssueType === "Feature" ? <FiPlus className="text-green-600" /> : 
                     <FiCheckSquare className="text-gray-600" />}
                    <span>
                      {taskIssueType === "Bug" ? "Bug" :
                       taskIssueType === "Feature" ? "Feature" : "Issue Type"}
                    </span>
                  </Button>

                  {showIssueTypePopup && (
                    <div
                      ref={issueTypePopupRef}
                      className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-48 z-20"
                    >
                      <p className="text-sm font-medium mb-2 text-gray-700">
                        Select issue type
                      </p>
                      {["Bug", "Feature", "Task"].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setTaskIssueType(type as any);
                            setShowIssueTypePopup(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md mb-1 last:mb-0 transition-colors flex items-center gap-2 ${
                            type === taskIssueType
                              ? type === "Bug"
                                ? "bg-red-50 text-red-700"
                                : type === "Feature"
                                ? "bg-green-50 text-green-700"
                                : "bg-blue-50 text-blue-700"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {type === "Bug" && <FiAlertCircle />}
                          {type === "Feature" && <FiPlus />}
                          {type === "Task" && <FiCheckSquare />}
                          <span>{type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Data Display */}
              {(taskAssignee || taskLabels.length > 0 || taskIssueType !== "Task") && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Options:</p>
                  
                  {taskAssignee && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        <span className="text-sm">Assignee:</span>
                        <span className="font-semibold">{taskAssignee}</span>
                      </div>
                    </div>
                  )}

                  {taskLabels.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiTag className="text-blue-600" />
                        <span className="text-sm">Labels:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {taskLabels.map((label) => (
                          <div
                            key={label}
                            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200"
                          >
                            <FiTag className="text-gray-400 text-xs" />
                            <span className="text-sm">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {taskIssueType !== "Task" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`${
                          taskIssueType === "Bug" ? "text-red-600" :
                          taskIssueType === "Feature" ? "text-green-600" :
                          "text-blue-600"
                        }`}>
                          {taskIssueType === "Bug" ? <FiAlertCircle /> :
                           taskIssueType === "Feature" ? <FiPlus /> : <FiCheckSquare />}
                        </span>
                        <span className="text-sm">Issue Type:</span>
                        <span className={`font-semibold ${
                          taskIssueType === "Bug" ? "text-red-700" :
                          taskIssueType === "Feature" ? "text-green-700" :
                          "text-blue-700"
                        }`}>
                          {taskIssueType}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                variant="secondary"
                onClick={() => setShowTaskModal(false)}
              >
                Cancel
              </Button>

              <Button onClick={handleSaveTask}>
                {editingTaskId ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showBoardModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Project Name *
              </label>
              <Input
                placeholder="Enter project name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowBoardModal(false);
                  setNewBoardName("");
                  setNewBoardDescription("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateBoard}>Create Project</Button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME PROJECT MODAL */}
      {showRenameBoardModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Rename Project</h2>

            <Input
              placeholder="New project name"
              value={renameBoardValue}
              onChange={(e) => setRenameBoardValue(e.target.value)}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowRenameBoardModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRenameBoard}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME LIST MODAL */}
      {showRenameListModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Rename List</h2>

            <Input
              placeholder="New list name"
              value={renameListValue}
              onChange={(e) => setRenameListValue(e.target.value)}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowRenameListModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRenameList}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  /* ---------------- MAIN RENDER ---------------- */
  return (
    <AppLayout>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Custom scrollbar for list boxes */
        .column-container > div:last-child::-webkit-scrollbar {
          width: 6px;
        }
        
        .column-container > div:last-child::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .column-container > div:last-child::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .column-container > div:last-child::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
      
      <div className="p-3">
        {viewMode === 'projects' ? renderProjectsView() : renderBoardView()}
        {renderModals()}
        
        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
        
        {/* Confirmation Modal */}
        {confirmationModal && (
          <ConfirmationModal
            title={confirmationModal.title}
            message={confirmationModal.message}
            onConfirm={() => {
              confirmationModal.onConfirm();
              setConfirmationModal(null);
            }}
            onCancel={() => setConfirmationModal(null)}
            confirmText={confirmationModal.confirmText}
            type={confirmationModal.type}
          />
        )}
      </div>
    </AppLayout>
  );
}