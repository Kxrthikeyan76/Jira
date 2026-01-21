// data/users.ts
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  location: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive";
  skills?: string[];
  bio?: string;
  profilePhoto?: string;
  projects?: number;
  tasks?: number;
  completedTasks?: number;
};

export const USERS: User[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
    role: "Administrator",
    department: "Management",
    location: "New York, USA",
    phone: "+1 (555) 123-4567",
    joinDate: "January 15, 2024",
    status: "active",
    skills: ["Leadership", "Project Management", "Strategy"],
    bio: "Experienced administrator with 8+ years in project management. Passionate about team development and process optimization.",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    projects: 12,
    tasks: 42,
    completedTasks: 38
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@example.com",
    password: "password123",
    role: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, USA",
    phone: "+1 (555) 987-6543",
    joinDate: "February 10, 2024",
    status: "active",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    bio: "Frontend specialist with 5 years of experience building responsive web applications. Love clean code and UI/UX design.",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    projects: 8,
    tasks: 24,
    completedTasks: 22
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    email: "michael@example.com",
    password: "password123",
    role: "Backend Developer",
    department: "Engineering",
    location: "Austin, USA",
    phone: "+1 (555) 456-7890",
    joinDate: "March 5, 2024",
    status: "active",
    skills: ["Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
    bio: "Backend engineer specializing in scalable systems and database architecture. Enjoy solving complex problems.",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    projects: 6,
    tasks: 18,
    completedTasks: 16
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "password123",
    role: "Product Manager",
    department: "Product",
    location: "Bangalore, India",
    phone: "+91 98765 43210",
    joinDate: "January 20, 2024",
    status: "active",
    skills: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
    bio: "Product leader focused on creating user-centric solutions. Background in computer science and business.",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    projects: 10,
    tasks: 35,
    completedTasks: 32
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    password: "password123",
    role: "UI/UX Designer",
    department: "Design",
    location: "London, UK",
    phone: "+44 20 7946 0958",
    joinDate: "February 28, 2024",
    status: "active",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
    bio: "Award-winning designer with focus on creating intuitive user experiences. Passionate about accessibility.",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    projects: 7,
    tasks: 21,
    completedTasks: 19
  },
  {
    id: 6,
    name: "Emma Thompson",
    email: "emma@example.com",
    password: "password123",
    role: "Marketing Specialist",
    department: "Marketing",
    location: "Toronto, Canada",
    phone: "+1 (416) 555-1234",
    joinDate: "March 15, 2024",
    status: "active",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media", "Analytics"],
    bio: "Marketing professional with expertise in digital campaigns and brand growth. Data-driven approach to marketing.",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    projects: 5,
    tasks: 15,
    completedTasks: 14
  },
  {
    id: 7,
    name: "James Lee",
    email: "james@example.com",
    password: "password123",
    role: "QA Engineer",
    department: "Engineering",
    location: "Seattle, USA",
    phone: "+1 (555) 789-0123",
    joinDate: "April 2, 2024",
    status: "active",
    skills: ["Testing", "Automation", "Selenium", "Jest", "CI/CD"],
    bio: "Quality assurance engineer ensuring software reliability. Detail-oriented with focus on automated testing.",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    projects: 9,
    tasks: 27,
    completedTasks: 25
  },
  {
    id: 8,
    name: "Olivia Martinez",
    email: "olivia@example.com",
    password: "password123",
    role: "DevOps Engineer",
    department: "Engineering",
    location: "Berlin, Germany",
    phone: "+49 30 12345678",
    joinDate: "April 18, 2024",
    status: "inactive",
    skills: ["Kubernetes", "Terraform", "CI/CD", "Monitoring", "Cloud Infrastructure"],
    bio: "DevOps specialist focused on scalable infrastructure and deployment automation. Currently on leave.",
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    projects: 4,
    tasks: 12,
    completedTasks: 12
  }
];