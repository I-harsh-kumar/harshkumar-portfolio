"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal as TerminalIcon,
  Cpu,
  Database,
  Cloud,
  Server,
  Globe,
  Workflow,
  Send,
  ExternalLink,
  Lock,
  RefreshCw,
  Play,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Activity,
  GitBranch,
  Code,
  Layers,
  Info,
  Shield,
  Sliders,
  Compass,
  Mail,
  Check,
  X,
  FileCode,
  TerminalSquare
} from "lucide-react";

// Inline Custom Brand Icons for full compatibility without relying on package versions
const GithubIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ============================================================================
// METRICS & MOCK DATA DEFINITIONS
// ============================================================================

interface SystemLog {
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  service: string;
  message: string;
}

interface PodState {
  name: string;
  status: "RUNNING" | "PENDING" | "RESTARTING" | "CRASH_LOOP";
  latency: number;
  cpu: number;
  restarts: number;
}

interface CommandOutput {
  id: string;
  input: string;
  output: React.ReactNode;
}

const INITIAL_LOGS: SystemLog[] = [
  { timestamp: "14:24:12", level: "INFO", service: "argocd", message: "Sync started for application 'eks-prod-main/auth-service'" },
  { timestamp: "14:24:15", level: "SUCCESS", service: "kubernetes", message: "Deployment rollout completed: auth-v2-7f9b8c09-2a1b is healthy" },
  { timestamp: "14:24:16", level: "INFO", service: "aws-alb", message: "Routing updated. Transitioning 10% traffic to auth-v2 pod pool" },
  { timestamp: "14:24:20", level: "WARN", service: "prometheus", message: "GCP load balancer API latency spiked (+32ms)" },
  { timestamp: "14:24:25", level: "INFO", service: "kubernetes", message: "CronJob 'db-backup-hourly' scheduled by cluster cron" },
  { timestamp: "14:24:27", level: "SUCCESS", service: "postgres-db", message: "Backup finalized. Uploaded to encrypted AWS S3 Bucket (s3://harsh-vault/db-backups/)" },
  { timestamp: "14:24:32", level: "INFO", service: "datadog-agent", message: "Ingested 1,245 APM traces. Peak throughput: 14.2k req/sec" },
];

const SKILL_CODE_SNIPPETS: Record<string, { language: string; code: string }> = {
  AWS: {
    language: "hcl (Terraform)",
    code: `# AWS Multi-AZ High-Availability Network Architecture
resource "aws_vpc" "prod_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "eks-production-vpc"
    Environment = "production"
  }
}

resource "aws_subnet" "private_az1" {
  vpc_id            = aws_vpc.prod_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/prod-eks"  = "shared"
  }
}`
  },
  Kubernetes: {
    language: "yaml (Kubernetes)",
    code: `# Kubernetes Microservice Rolling Update Spec
apiVersion: apps/v1
kind: Deployment
metadata:
  name: billing-service
  namespace: production
  labels:
    app: billing-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: billing-service
  template:
    metadata:
      labels:
        app: billing-service
    spec:
      containers:
      - name: billing-service
        image: gcr.io/harsh-prod/billing-service:v2.4.1
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10`
  },
  Terraform: {
    language: "hcl (Terraform)",
    code: `# Infrastructure-As-Code: AWS EKS Provisioning
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "eks-prod-main"
  cluster_version = "1.30"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      min_size     = 3
      max_size     = 10
      desired_size = 4

      instance_types = ["t3.xlarge"]
      capacity_type  = "ON_DEMAND"
      
      labels = {
        Environment = "production"
        Role        = "general-worker"
      }
    }
  }
}`
  },
  Docker: {
    language: "dockerfile",
    code: `# Optimized Multi-Stage Build for Go Microservice
FROM golang:1.22-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/app ./cmd/main.go

# Minimal, secure production container image
FROM gcr.io/distroless/static-debian12:latest-amd64
COPY --from=builder /bin/app /app
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/app"]`
  },
  "CI/CD": {
    language: "yaml (GitHub Actions)",
    code: `# GitHub Actions Pipeline: Test, Scan & Deploy to AWS EKS
name: Continuous Integration & Delivery

on:
  push:
    branches: [ "main" ]

jobs:
  test_and_build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Run Security Audit (Trivy)
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'gcr.io/harsh-prod/api-service:\${{ github.sha }}'
        exit-code: '1'
        ignore-unfixed: true

    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1`
  },
  Observability: {
    language: "json (Datadog Configuration)",
    code: `// Prometheus/Datadog Dynamic Metric Monitor
{
  "id": "datadog-prod-eks-latency",
  "name": "High HTTP Gateway Latency - Environment: production",
  "type": "query alert",
  "query": "avg(last_5m):avg:trace.http.request.duration{env:production,service:frontend} > 0.12",
  "message": "@slack-alerts-devops [PROD] Frontend ingress latency exceeded 120ms threshold. Triggering Auto-scaling.",
  "options": {
    "thresholds": {
      "critical": 0.12,
      "warning": 0.08
    },
    "notify_no_data": false,
    "evaluation_delay": 60
  }
}`
  }
};

const PIPELINE_TIMELINE = [
  {
    stage: "PLAN",
    status: "SUCCESS",
    color: "emerald",
    role: "Junior Systems Engineer",
    company: "CloudSphere Solutions",
    period: "2018 - 2020",
    description: "Laid down rigorous DevOps foundations by implementing automated daily system recovery tasks and shell-script pipelines.",
    achievements: [
      "Wrote Bash automation scripts reducing system log backup workloads by 35%.",
      "Configured secure Nginx reverse proxies, SSL/TLS protocols, and load balancing routers.",
      "Managed AWS resources (EC2, S3, IAM) for 15+ micro-sites, maintaining 99.9% VM uptime.",
    ],
    tech: ["Linux Admin", "Bash Scripting", "Nginx", "AWS S3", "Nagios Core"]
  },
  {
    stage: "BUILD",
    status: "SUCCESS",
    color: "cyan",
    role: "DevOps Engineer",
    company: "NexaTech Platforms",
    period: "2020 - 2022",
    description: "Drove transition to modular cloud deployments, automating physical servers into multi-region cloud resources.",
    achievements: [
      "Refactored legacy deployment processes to Terraform modular infrastructure (IaC), saving 60+ engineering hours weekly.",
      "Containerized over 35 distributed applications using multi-stage Docker builds.",
      "Created fully decoupled CI/CD workflows using GitLab CI, shortening deployments to production from 2 hours to 8 minutes.",
    ],
    tech: ["Terraform", "Docker", "GitLab CI/CD", "Ansible", "Python", "CentOS"]
  },
  {
    stage: "DEPLOY",
    status: "SUCCESS",
    color: "amber",
    role: "Senior Infrastructure Architect",
    company: "PeakScale Global",
    period: "2022 - 2024",
    description: "Designed, engineered, and operated massive multi-tenant container cluster networks globally.",
    achievements: [
      "Engineered multi-region AWS EKS Kubernetes clusters handling over 5,000,000 requests daily.",
      "Established fully automated GitOps workflows using ArgoCD, aligning code commits directly with live cluster rollouts.",
      "Slashed AWS monthly overhead expenditures by 28% through custom scaling schedules and smart spot instance configuration.",
    ],
    tech: ["Kubernetes", "AWS EKS", "ArgoCD", "Helm", "VPC Peering", "Jenkins Core"]
  },
  {
    stage: "MONITOR",
    status: "RUNNING",
    color: "purple",
    role: "Lead Cloud Consultant & Architect",
    company: "Freelance / Cloud Consult",
    period: "2024 - Present",
    description: "Directing next-generation distributed container frameworks with deep service meshes and intelligent APM monitoring.",
    achievements: [
      "Designing highly resilient multi-cloud topologies across AWS and GCP, targeting a 99.999% SLA.",
      "Implementing comprehensive Datadog and Prometheus/Grafana dashboards, reducing average MTTR from 45m to under 3m.",
      "Architecting zero-downtime service mesh environments utilizing Istio for traffic control, circuit breaking, and secure mTLS.",
    ],
    tech: ["AWS", "GCP", "Kubernetes", "Datadog", "Prometheus", "Grafana", "Istio", "gRPC"]
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [historyList, setHistoryList] = useState<string[]>([]);
  
  // Custom states for cloud metrics
  const [cpuUsage, setCpuUsage] = useState(24.8);
  const [memUsage, setMemUsage] = useState(41.2);
  const [iops, setIops] = useState(1280);
  const [networkIn, setNetworkIn] = useState(42.5);
  const [networkOut, setNetworkOut] = useState(18.2);
  const [pods, setPods] = useState<PodState[]>([
    { name: "auth-v2-pod-1", status: "RUNNING", latency: 12, cpu: 8, restarts: 0 },
    { name: "payment-srv-pod", status: "RUNNING", latency: 45, cpu: 14, restarts: 1 },
    { name: "redis-cache-0", status: "RUNNING", latency: 2, cpu: 5, restarts: 0 },
    { name: "frontend-ui-pod", status: "RUNNING", latency: 18, cpu: 11, restarts: 0 },
  ]);
  const [logsList, setLogsList] = useState<SystemLog[]>(INITIAL_LOGS);

  // Experience and Skills detail selectors
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(3); // Default to MONITOR
  const [selectedSkillSnippet, setSelectedSkillSnippet] = useState("Kubernetes");

  // Contact form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [formLog, setFormLog] = useState<string[]>([]);
  const [formSuccess, setFormSuccess] = useState(false);

  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // SIDE-EFFECTS & REAL-TIME EMULATORS
  // ============================================================================

  useEffect(() => {
    setMounted(true);
    // Focus terminal input
    terminalInputRef.current?.focus();

    // Trigger initial terminal welcome screen
    const welcomeOutput = (
      <div className="space-y-2 text-xs leading-relaxed text-slate-300">
        <pre className="text-emerald-400 font-bold overflow-x-auto select-none leading-tight">
{` ██████╗ ██████╗ ███████╗██████╗  ██████╗ ██████╗ ███████╗
██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔══██╗██╔════╝
██║   ██║██████╔╝█████╗  ██████╔╝██║   ██║██████╔╝███████╗
██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗██║   ██║██╔═══╝ ╚════██║
╚██████╔╝██║     ███████╗██║  ██║╚██████╔╝██║     ███████║
 ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝`}
        </pre>
        <div className="border-t border-slate-900 my-2 pt-2 text-[10px] uppercase tracking-widest text-slate-500 flex justify-between">
          <span>OPERATOR INTERFACE v4.12.0</span>
          <span>CLUSTER: EKS-PROD-MAIN</span>
        </div>
        <p>
          Welcome to the DevOps and Cloud Operator Console of <span className="text-emerald-400 font-bold">Harsh Kumar</span>.
          This console offers a live window into production cloud instances, system metrics, and architectural logs.
        </p>
        <p>
          Type <span className="text-cyan-400 font-bold">help</span> to list available operator commands or try:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {["whoami", "skills", "projects", "pipeline", "metrics", "logs"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleFastCommand(cmd)}
              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded text-emerald-400 text-[11px] font-mono transition-all cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    );

    setHistory([{ id: "welcome", input: "system-init", output: welcomeOutput }]);
  }, []);

  // CPU, RAM & IOPS fluctuator
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = (Math.random() - 0.5) * 4;
        const next = Math.max(10, Math.min(95, prev + delta));
        return parseFloat(next.toFixed(1));
      });
      setMemUsage((prev) => {
        const delta = (Math.random() - 0.5) * 1.5;
        const next = Math.max(30, Math.min(90, prev + delta));
        return parseFloat(next.toFixed(1));
      });
      setIops((prev) => {
        const delta = Math.floor((Math.random() - 0.5) * 80);
        return Math.max(800, Math.min(2500, prev + delta));
      });
      setNetworkIn((prev) => {
        const delta = (Math.random() - 0.5) * 5;
        return parseFloat(Math.max(15, Math.min(120, prev + delta)).toFixed(1));
      });
      setNetworkOut((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        return parseFloat(Math.max(5, Math.min(60, prev + delta)).toFixed(1));
      });

      // Periodically update some pods' latencies & status fluctuations
      setPods((prevPods) => {
        return prevPods.map((p) => {
          let status = p.status;
          let latency = p.latency;
          let cpu = p.cpu;
          let restarts = p.restarts;

          // Introduce a temporary small latency spike or micro-restart fluctuation for payment-srv-pod
          if (p.name === "payment-srv-pod" && Math.random() > 0.85) {
            latency = Math.floor(60 + Math.random() * 40);
            cpu = Math.floor(18 + Math.random() * 5);
          } else if (p.name === "payment-srv-pod") {
            latency = Math.floor(40 + Math.random() * 10);
            cpu = Math.floor(12 + Math.random() * 4);
          } else {
            latency = Math.max(1, p.latency + Math.floor((Math.random() - 0.5) * 4));
            cpu = Math.max(1, p.cpu + Math.floor((Math.random() - 0.5) * 3));
          }

          // Random rare mock crash/restart logic
          if (p.name === "payment-srv-pod" && Math.random() > 0.98) {
            restarts += 1;
            status = "RESTARTING";
            setTimeout(() => {
              setPods((currPods) =>
                currPods.map((currP) =>
                  currP.name === "payment-srv-pod" ? { ...currP, status: "RUNNING" } : currP
                )
              );
            }, 3000);
          }

          return { ...p, status, latency, cpu, restarts };
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [mounted]);

  // Live Cloud log stream injector
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const services = ["argocd", "kubernetes", "aws-alb", "prometheus", "datadog-agent", "postgres-db", "envoy-gateway"];
      const messages = [
        { level: "INFO" as const, msg: "Deployment rolled out v2.4.2 successfully" },
        { level: "SUCCESS" as const, msg: "ReplicaSet scale down complete for 'billing-service'" },
        { level: "WARN" as const, msg: "APM Tracing alert: DB connection pool usage reached 74%" },
        { level: "INFO" as const, msg: "Syncing Git commits from production branch on GitHub" },
        { level: "SUCCESS" as const, msg: "Ingress SSL certs renewal check completed successfully (expires in 88 days)" },
        { level: "ERROR" as const, msg: "Webhook delivery failure: Slack API endpoint returned 502 Bad Gateway. Retrying in 5s." },
        { level: "INFO" as const, msg: "Traffic policy configured: route weight 90/10 active on active/passive split" },
      ];

      const selectedSvc = services[Math.floor(Math.random() * services.length)];
      const selection = messages[Math.floor(Math.random() * messages.length)];
      
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      const newLog: SystemLog = {
        timestamp: timeStr,
        level: selection.level,
        service: selectedSvc,
        message: selection.msg
      };

      setLogsList((prev) => [newLog, ...prev.slice(0, 15)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [mounted]);

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // ============================================================================
  // BASH TERMINAL COMMAND PROCESSING
  // ============================================================================

  const handleFastCommand = (cmd: string) => {
    executeCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmed = input.trim();
      if (!trimmed) return;
      executeCommand(trimmed);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyList.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < historyList.length) {
        setHistoryIndex(nextIndex);
        setInput(historyList[historyList.length - 1 - nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(historyList[historyList.length - 1 - nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const executeCommand = (cmdStr: string) => {
    const rawCmd = cmdStr.toLowerCase().trim();
    const cmdArgs = rawCmd.split(" ");
    const primaryCmd = cmdArgs[0];

    setHistoryList((prev) => [...prev, cmdStr]);
    setHistoryIndex(-1);
    setInput("");

    let outputElement: React.ReactNode = null;

    switch (primaryCmd) {
      case "help":
      case "?":
        outputElement = (
          <div className="space-y-1.5 text-xs">
            <p className="text-emerald-400 font-bold">AVAILABLE OPERATOR COMMANDS:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 pl-2 font-mono">
              <div><span className="text-cyan-400 font-bold">whoami</span> - Displays bio, title, and DevOps core mission statement.</div>
              <div><span className="text-cyan-400 font-bold">skills</span> - Returns core technical proficiencies.</div>
              <div><span className="text-cyan-400 font-bold">projects</span> - Shows details on high-fidelity deployments and architecture specs.</div>
              <div><span className="text-cyan-400 font-bold">pipeline</span> - Triggers Career Pipeline timeline logs.</div>
              <div><span className="text-cyan-400 font-bold">metrics</span> - Executes diagnostic telemetry readout of cloud pods.</div>
              <div><span className="text-cyan-400 font-bold">logs</span> - Ingests and renders active streaming syslog entries.</div>
              <div><span className="text-cyan-400 font-bold">certifications</span> - Outputs certified cloud/Kubernetes credentials.</div>
              <div><span className="text-cyan-400 font-bold">contact</span> - Prints REST endpoints and links to establish webhook/email hook.</div>
              <div><span className="text-cyan-400 font-bold">clear</span> - Clears terminal log output stream.</div>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">💡 Pro-tip: You can click the green quick buttons below the prompt to auto-run commands.</p>
          </div>
        );
        break;

      case "whoami":
        outputElement = (
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2 border-b border-slate-900 pb-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-white text-sm">Harsh Kumar</span>
              <span className="text-emerald-400 text-[10px] border border-emerald-500/20 px-1 py-0.2 rounded bg-emerald-500/5">SENIOR DEVOPS ENGINEER</span>
            </div>
            <p className="italic text-slate-400">
              &quot;Automating cloud infrastructure, optimizing CI/CD workflows, and scaling high-availability container systems. Passionate about infrastructure-as-code and observability.&quot;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1 pl-1">
              <div><span className="text-slate-500">🏢 Current Status:</span> Freelance Principal Consultant</div>
              <div><span className="text-slate-500">🌍 Core Regions:</span> us-east-1, eu-west-1, ap-south-1</div>
              <div><span className="text-slate-500">☸️ Containers Run:</span> 2,400+ production pods</div>
              <div><span className="text-slate-500">📜 Top Certs:</span> AWS Solutions Architect Pro, CKA (Kubernetes)</div>
            </div>
          </div>
        );
        break;

      case "skills":
        outputElement = (
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-emerald-400 font-bold">CORE TECHNICAL CONFIGURATIONS:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pl-1">
              <div className="border border-slate-900 bg-slate-950/40 p-2 rounded">
                <span className="text-cyan-400 font-bold block mb-1">☁️ Cloud Platforms</span>
                <span className="text-slate-400 text-[11px]">AWS, GCP, VPC Peering, DirectConnect, Route53, IAM Security Policies</span>
              </div>
              <div className="border border-slate-900 bg-slate-950/40 p-2 rounded">
                <span className="text-cyan-400 font-bold block mb-1">☸️ Container Systems</span>
                <span className="text-slate-400 text-[11px]">Kubernetes, EKS, GKE, Docker, Docker-Compose, Helm, Istio, Linkerd</span>
              </div>
              <div className="border border-slate-900 bg-slate-950/40 p-2 rounded">
                <span className="text-cyan-400 font-bold block mb-1">⚙️ Infrastructure IaC</span>
                <span className="text-slate-400 text-[11px]">Terraform (Modules/Workspaces), Ansible playbooks, Bash shell, Python</span>
              </div>
              <div className="border border-slate-900 bg-slate-950/40 p-2 rounded">
                <span className="text-cyan-400 font-bold block mb-1">⛓️ CI/CD Pipelines</span>
                <span className="text-slate-400 text-[11px]">GitHub Actions, GitLab CI/CD, Jenkins pipelines, ArgoCD GitOps, Travis</span>
              </div>
              <div className="border border-slate-900 bg-slate-950/40 p-2 rounded">
                <span className="text-cyan-400 font-bold block mb-1">📈 Observability Stack</span>
                <span className="text-slate-400 text-[11px]">Datadog APM, Prometheus, Grafana metrics, ELK Stack, Jaeger tracing</span>
              </div>
              <div className="border border-slate-900 bg-slate-950/40 p-2 rounded">
                <span className="text-cyan-400 font-bold block mb-1">🐧 OS & Storage</span>
                <span className="text-slate-400 text-[11px]">RHEL, Ubuntu Server, Nginx, PostgreSQL, Redis caches, S3 Vault</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">💡 Hint: Scroll down to our dynamic Skill Configuration Matrix to click skills and view IaC specs!</p>
          </div>
        );
        break;

      case "projects":
        outputElement = (
          <div className="space-y-3 text-xs text-slate-300">
            <p className="text-emerald-400 font-bold">FEATURED ACTIVE PROJECTS:</p>
            
            <div className="border-l-2 border-emerald-500/40 pl-3 py-0.5 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>✦ Multi-Region K8s Cluster Automation</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <p className="text-slate-400">
                Automated multi-region provisioning of Kubernetes (EKS/GKE) clusters using modular Terraform architecture. Continuous deployments governed strictly by ArgoCD GitOps pipelines.
              </p>
              <div className="text-[11px] text-slate-500">
                <span className="text-cyan-400">Infrastructure:</span> Terraform, AWS EKS, GCP, ArgoCD, Helm, Route53, VPC peering
              </div>
            </div>

            <div className="border-l-2 border-cyan-500/40 pl-3 py-0.5 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>✦ High-Availability Microservices Topology</span>
                <span className="text-cyan-400">ACTIVE</span>
              </div>
              <p className="text-slate-400">
                Engineered a bulletproof resilient architecture on AWS. Managed load-balancing of distributed container nodes, utilizing Auto Scaling groups, secure RDS multi-AZ databases, and full Datadog APM metrics.
              </p>
              <div className="text-[11px] text-slate-500">
                <span className="text-cyan-400">Infrastructure:</span> AWS VPC, EC2 Auto Scaling, ALBs, Datadog APM, Postgres RDS, Prometheus
              </div>
            </div>
          </div>
        );
        break;

      case "pipeline":
        outputElement = (
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-emerald-400 font-bold">CAREER DEPLOYMENT PIPELINE STATUS:</p>
            <div className="flex items-center space-x-1 font-mono text-[11px] bg-slate-950/80 p-2 border border-slate-900 rounded">
              <span className="text-emerald-400 font-bold">PLAN</span>
              <span className="text-slate-600">--[SUCCESS]--&gt;</span>
              <span className="text-cyan-400 font-bold">BUILD</span>
              <span className="text-slate-600">--[SUCCESS]--&gt;</span>
              <span className="text-amber-400 font-bold">DEPLOY</span>
              <span className="text-slate-600">--[SUCCESS]--&gt;</span>
              <span className="text-purple-400 font-bold">MONITOR</span>
              <span className="text-slate-400 font-bold animate-pulse"> [RUNNING]</span>
            </div>
            <div className="pl-1 pt-1 space-y-1">
              <p className="text-emerald-400 font-bold">Current Deployment: Lead Cloud Architect (2024-Present)</p>
              <p className="text-slate-400">
                Designing highly available multi-cloud meshes handling heavy traffic loads and distributed tracing networks.
              </p>
              <p className="text-[10px] text-slate-500">💡 Hint: Interactively click nodes in the Career Pipeline Timeline section below for exact metrics and achievements!</p>
            </div>
          </div>
        );
        break;

      case "metrics":
        outputElement = (
          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="text-emerald-400 font-bold">CLOUD CLUSTER HEALTH STATUS DIAGNOSTIC REPORT:</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono">
              <div>AWS Region: <span className="text-white">us-east-1</span></div>
              <div>Active Nodes: <span className="text-emerald-400">24 / 24 Healthy</span></div>
              <div>Datacenter Latency: <span className="text-emerald-400">14ms (RTT)</span></div>
              <div>Cluster SLA: <span className="text-white">99.999% Operational</span></div>
              <div>Total CPU Allocation: <span className="text-white">{cpuUsage}%</span></div>
              <div>Total memory Pool: <span className="text-white">{memUsage}%</span></div>
              <div>Active ingress rate: <span className="text-cyan-400">{networkIn} MB/s</span></div>
              <div>Active egress rate: <span className="text-cyan-400">{networkOut} MB/s</span></div>
            </div>
            <div className="border border-slate-900 p-2 rounded bg-black/40 mt-1">
              <p className="text-cyan-400 font-bold mb-1 text-[11px]">POD SPEC CHECK LIST:</p>
              <div className="space-y-0.5 text-[11px]">
                {pods.map((p) => (
                  <div key={p.name} className="flex justify-between">
                    <span className="text-slate-400">☸️ {p.name}</span>
                    <span className={p.status === "RUNNING" ? "text-emerald-400" : "text-amber-400 animate-pulse"}>
                      [{p.status}] (CPU: {p.cpu}%, Latency: {p.latency}ms, Restarts: {p.restarts})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        break;

      case "logs":
        outputElement = (
          <div className="space-y-1 text-xs">
            <p className="text-emerald-400 font-bold">INGESTED CLOUD WORKLOAD SYSLOG:</p>
            <div className="bg-slate-950/80 p-2 border border-slate-900 rounded font-mono text-[10px] space-y-1 overflow-y-auto max-h-[150px]">
              {logsList.map((log, index) => {
                const colors = {
                  INFO: "text-blue-400",
                  SUCCESS: "text-emerald-400",
                  WARN: "text-amber-400",
                  ERROR: "text-red-400"
                };
                return (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-slate-600">[{log.timestamp}]</span>
                    <span className={`font-bold ${colors[log.level]}`}>[{log.level}]</span>
                    <span className="text-cyan-400 font-bold">&lt;{log.service}&gt;</span>
                    <span className="text-slate-400 flex-1">{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
        break;

      case "certifications":
        outputElement = (
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-emerald-400 font-bold">VERIFIED TECHNICAL CREDENTIALS & CERTIFICATIONS:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono">
              <div className="border border-slate-900 bg-slate-950/50 p-2 rounded flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <span className="text-white font-bold block text-xs">AWS Certified Solutions Architect – Professional</span>
                  <span className="text-slate-500 text-[10px]">Credential ID: AWS-SAP-74128</span>
                </div>
              </div>
              <div className="border border-slate-900 bg-slate-950/50 p-2 rounded flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <span className="text-white font-bold block text-xs">Certified Kubernetes Administrator (CKA)</span>
                  <span className="text-slate-500 text-[10px]">Cloud Native Computing Foundation (CNCF)</span>
                </div>
              </div>
              <div className="border border-slate-900 bg-slate-950/50 p-2 rounded flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <span className="text-white font-bold block text-xs">AWS Certified DevOps Engineer – Professional</span>
                  <span className="text-slate-500 text-[10px]">Credential ID: AWS-DOP-19854</span>
                </div>
              </div>
              <div className="border border-slate-900 bg-slate-950/50 p-2 rounded flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <span className="text-white font-bold block text-xs">HashiCorp Certified: Terraform Associate</span>
                  <span className="text-slate-500 text-[10px]">Credential ID: HC-TF-32984</span>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case "contact":
        outputElement = (
          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="text-emerald-400 font-bold">ESTABLISH CHANNELS & CALLBACK ENDPOINTS:</p>
            <p className="text-slate-400">
              You can hook up with Harsh using standard protocols:
            </p>
            <div className="space-y-1 font-mono pl-1 pt-1 text-[11px]">
              <div>📬 Email API Endpoint: <span className="text-white">harsh.kumar.devops@gmail.com</span></div>
              <div>🔗 LinkedIn Gateway: <a href="https://linkedin.com/in/harshkumar-devops" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-emerald-400">linkedin.com/in/harshkumar-devops</a></div>
              <div>💻 GitHub Registry: <a href="https://github.com/harshkumar-devops" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-emerald-400">github.com/harshkumar-devops</a></div>
              <div>🔐 SSH Access: <span className="text-slate-500">ssh harsh@harshkumar.online -p 2202</span></div>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">💡 Hint: Scroll to the bottom and submit the Rest API payload to queue a ping directly to his inbox!</p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        outputElement = (
          <div className="text-red-400 font-mono text-xs">
            🚫 Command not recognized: &quot;{primaryCmd}&quot;. Type <span className="text-cyan-400 font-bold underline cursor-pointer" onClick={() => executeCommand("help")}>help</span> to view all valid operational tags.
          </div>
        );
    }

    const uniqueId = Math.random().toString(36).substr(2, 9);
    setHistory((prev) => [...prev, { id: uniqueId, input: cmdStr, output: outputElement }]);
  };

  // ============================================================================
  // REST CLIENT (CONTACT FORM) COMPILER
  // ============================================================================

  const handleSendForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;

    setFormSubmitting(true);
    setFormProgress(5);
    setFormLog([]);
    setFormSuccess(false);

    const logSteps = [
      { prg: 20, log: "📡 INITIALIZING ROUTE: Connecting to https://api.harshkumar.dev/v1/contact..." },
      { prg: 35, log: "🔒 SECURITY: Negotiating secure TLSv1.3 handshake with cloud server..." },
      { prg: 50, log: "⚙️ GATEWAY: Request routed to AWS API Gateway in us-east-1a cluster..." },
      { prg: 70, log: "☸️ WORKLOAD: Invoking AWS Lambda lambda-contact-handler on micro-pod..." },
      { prg: 85, log: "💾 DATABASE: Storing payload securely in RDS DynamoDB table..." },
      { prg: 100, log: "✅ STATUS: 202 Accepted. Queue payload written to server. Closing connection." },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        setFormProgress(logSteps[currentStep].prg);
        setFormLog((prev) => [...prev, logSteps[currentStep].log]);
        currentStep++;
      } else {
        clearInterval(interval);
        setFormSubmitting(false);
        setFormSuccess(true);
      }
    }, 1200);
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormMsg("");
    setFormSuccess(false);
    setFormLog([]);
    setFormProgress(0);
  };

  // Safe Date and time strings for Hydration
  const dateStr = mounted ? new Date().toDateString() : "Sun Jun 28 2026";
  const timezoneStr = mounted ? "UTC-5 (EST)" : "EST";

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 font-mono flex flex-col selection:bg-emerald-500 selection:text-black relative overflow-x-hidden scanlines">
      {/* BACKGROUND GRAPHIC ELEMENT */}
      <div className="absolute inset-0 terminal-grid pointer-events-none z-0 opacity-80" />
      <div className="absolute inset-0 terminal-grid-dense pointer-events-none z-0 opacity-40" />

      {/* ============================================================================
          HEADER / STATUS NAVIGATION BAR
         ============================================================================ */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-black/90 backdrop-blur-md px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-200" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white tracking-tight uppercase text-sm">harsh.ops.terminal</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.1 text-[9px] font-bold tracking-wider uppercase">
                PROD MAIN
              </span>
            </div>
            <span className="text-[10px] text-slate-500">SYS_ADMIN: HARSH_KUMAR</span>
          </div>
        </div>

        {/* METADATA BANNER (MIDDLE) */}
        <div className="hidden lg:flex items-center space-x-6 text-[10px] text-slate-500 tracking-wider">
          <div>REGION: <span className="text-emerald-400">us-east-1</span></div>
          <div className="h-3 w-px bg-slate-900" />
          <div>CLUSTER: <span className="text-cyan-400">eks-prod-main</span></div>
          <div className="h-3 w-px bg-slate-900" />
          <div>NODE_POOL: <span className="text-amber-400">general-worker-2026</span></div>
          <div className="h-3 w-px bg-slate-900" />
          <div>GLOBAL_SLA: <span className="text-emerald-400">99.999%</span></div>
        </div>

        {/* FLOATING ACTION NAVIGATION */}
        <nav className="flex items-center justify-end space-x-1.5 md:space-x-2.5 w-full md:w-auto overflow-x-auto py-1">
          <a href="#dashboard" className="px-2 py-1 text-[11px] font-bold rounded border border-transparent text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            CONSOLE
          </a>
          <a href="#about" className="px-2 py-1 text-[11px] font-bold rounded border border-transparent text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            ABOUT
          </a>
          <a href="#skills" className="px-2 py-1 text-[11px] font-bold rounded border border-transparent text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            CONFIG
          </a>
          <a href="#pipeline" className="px-2 py-1 text-[11px] font-bold rounded border border-transparent text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            PIPELINE
          </a>
          <a href="#projects" className="px-2 py-1 text-[11px] font-bold rounded border border-transparent text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
            DEPLOYMENTS
          </a>
          <a href="#contact" className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold rounded transition-all text-[11px]">
            API_CONTACT
          </a>
        </nav>
      </header>

      {/* ============================================================================
          MAIN BODY LAYOUT
         ============================================================================ */}
      <main className="flex-1 p-4 md:p-8 flex flex-col max-w-7xl mx-auto w-full space-y-12 z-10">

        {/* ============================================================================
            HERO: SPLIT-SCREEN OPERATOR TERMINAL & LIVE CLOUD MONITOR
           ============================================================================ */}
        <section id="dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          
          {/* LEFT COLUMN: INTERACTIVE BASH TERMINAL (7/12 COLS) */}
          <div className="lg:col-span-7 flex flex-col bg-black/90 border border-slate-800 rounded-lg shadow-2xl shadow-emerald-500/5 h-[580px] overflow-hidden relative border-pulse-active group">
            <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            
            {/* TERMINAL HEADER */}
            <div className="bg-[#05070a]/90 px-4 py-3 flex items-center justify-between border-b border-slate-900 select-none">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors" />
                <span className="text-slate-500 font-mono text-[11px] pl-2 flex items-center gap-1.5">
                  <TerminalIcon className="h-3.5 w-3.5 text-slate-500" />
                  operator@eks-prod-main:~
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500/70 uppercase">ONLINE</span>
              </div>
            </div>

            {/* TERMINAL SCREEN BODY */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 font-mono leading-relaxed bg-[#010102]/95 crt-effect text-slate-100">
              
              {/* HISTORIC STREAM */}
              {history.map((h) => (
                <div key={h.id} className="space-y-1.5">
                  {h.input !== "system-init" && (
                    <div className="flex items-center space-x-1.5 text-emerald-400 text-xs">
                      <span className="text-slate-500">harsh@devops:~$</span>
                      <span className="text-slate-100 font-bold">{h.input}</span>
                    </div>
                  )}
                  <div className="pl-2 border-l border-slate-950">{h.output}</div>
                </div>
              ))}
              
              <div ref={terminalBottomRef} />
            </div>

            {/* FIXED PROMPT BAR */}
            <div className="bg-[#05070a]/90 border-t border-slate-900 p-4">
              <div className="flex items-center text-xs text-emerald-400 font-bold font-mono">
                <span className="text-slate-500 mr-2 shrink-0 select-none">harsh@devops:~$</span>
                <input
                  ref={terminalInputRef}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono caret-emerald-400 selection:bg-emerald-500 selection:text-black placeholder:text-slate-700"
                  placeholder="Type config commands here (e.g., help, skills, metrics)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* HANDY CLICK COMPANIONS */}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-950 overflow-x-auto no-scrollbar">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider shrink-0 select-none">QUICK COMMANDS:</span>
                {["whoami", "skills", "projects", "pipeline", "metrics", "logs", "certifications", "contact"].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleFastCommand(cmd)}
                    className="px-2 py-0.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-emerald-500/40 rounded text-emerald-400 text-[10px] font-mono shrink-0 transition-all cursor-pointer"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CLOUD MONITOR DASHBOARD (5/12 COLS) */}
          <div className="lg:col-span-5 flex flex-col bg-[#020305]/95 border border-slate-800 rounded-lg shadow-2xl h-[580px] overflow-hidden">
            
            {/* CLOUD MONITOR HEADER */}
            <div className="bg-[#05070a]/90 px-4 py-3 flex items-center justify-between border-b border-slate-900 select-none">
              <div className="flex items-center space-x-2 text-white">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span className="font-bold text-[11px] tracking-wide uppercase">DEVOPS REALTIME MONITOR</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-slate-500">REFRESH_RATE: 2.5s</span>
              </div>
            </div>

            {/* MONITOR CONTENT BODY */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 font-mono text-xs">
              
              {/* PRIMARY CLUSTER METRICS */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/40 border border-slate-900 p-2.5 rounded-md flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500" />
                  <span className="text-slate-500 text-[9px] uppercase tracking-wide">CLUSTER CPU</span>
                  <span className="text-white font-bold text-lg leading-tight mt-1">{cpuUsage}%</span>
                  <div className="h-1 bg-slate-950 rounded overflow-hidden mt-2">
                    <motion.div 
                      className="h-full bg-emerald-500" 
                      animate={{ width: `${cpuUsage}%` }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="bg-black/40 border border-slate-900 p-2.5 rounded-md flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-cyan-500" />
                  <span className="text-slate-500 text-[9px] uppercase tracking-wide">CLUSTER MEMORY</span>
                  <span className="text-white font-bold text-lg leading-tight mt-1">{memUsage}%</span>
                  <div className="h-1 bg-slate-950 rounded overflow-hidden mt-2">
                    <motion.div 
                      className="h-full bg-cyan-500" 
                      animate={{ width: `${memUsage}%` }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="bg-black/40 border border-slate-900 p-2.5 rounded-md flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500" />
                  <span className="text-slate-500 text-[9px] uppercase tracking-wide">STORAGE IOPS</span>
                  <span className="text-white font-bold text-sm leading-tight mt-1">{iops} i/o</span>
                  <div className="text-[9px] text-slate-500 mt-2 truncate">READPOOL_OK</div>
                </div>
              </div>

              {/* NETWORK BANDWIDTH CARD */}
              <div className="bg-black/40 border border-slate-900 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">TRAFFIC BANDWIDTH EGRESS/INGRESS</span>
                  <span className="text-[9px] text-slate-500">TCP PROTOCOL STACK</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>INCOMING (Rx)</span>
                      <span className="text-cyan-400 font-bold">{networkIn} MB/s</span>
                    </div>
                    <div className="flex items-end gap-1 h-8 mt-1.5">
                      {[30, 45, 60, 50, 40, 75, 90, 80, 55, 68, networkIn / 1.2].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${Math.min(100, Math.max(10, h))}%` }}
                          className="flex-1 bg-cyan-500/20 hover:bg-cyan-400/40 rounded-t transition-all telemetry-bar"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>OUTGOING (Tx)</span>
                      <span className="text-amber-400 font-bold">{networkOut} MB/s</span>
                    </div>
                    <div className="flex items-end gap-1 h-8 mt-1.5">
                      {[15, 25, 40, 35, 12, 45, 55, 30, 20, 38, networkOut / 0.6].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${Math.min(100, Math.max(10, h))}%` }}
                          className="flex-1 bg-amber-500/20 hover:bg-amber-400/40 rounded-t transition-all telemetry-bar"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* KUBERNETES CONTAINER STATUSES */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">KUBERNETES MICROSERVICE PODS</span>
                  <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                    <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                    NAMESPACE: PRODUCTION
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {pods.map((p) => {
                    const statusColors = {
                      RUNNING: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                      PENDING: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 animate-pulse",
                      RESTARTING: "bg-amber-500/20 border-amber-500/40 text-amber-400 animate-bounce",
                      CRASH_LOOP: "bg-red-500/10 border-red-500/20 text-red-400 animate-ping",
                    };
                    return (
                      <div
                        key={p.name}
                        className="bg-black/40 border border-slate-900 px-3 py-2 rounded flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-600">☸️</span>
                          <span className="text-slate-300 font-bold truncate max-w-[120px] sm:max-w-none">{p.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-right">
                          <span className="text-slate-500 text-[10px]">CPU: {p.cpu}%</span>
                          <span className="text-slate-500 text-[10px]">RTT: {p.latency}ms</span>
                          <span className={`px-1.5 py-0.5 border text-[9px] font-bold rounded ${statusColors[p.status]}`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LIVE LOG STREAM MODULE */}
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">AWS / K8S INGRESS LOG STREAM</span>
                  <span className="text-[9px] text-slate-500">TCP FEED INGESTED OK</span>
                </div>

                <div className="bg-black/90 p-3 border border-slate-900 rounded font-mono text-[10px] space-y-1.5 h-[135px] overflow-y-auto overflow-x-hidden relative scrollbar-thin">
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-slate-900" />
                  <AnimatePresence initial={false}>
                    {logsList.map((log, index) => {
                      const badgeColors = {
                        INFO: "text-blue-400",
                        SUCCESS: "text-emerald-400",
                        WARN: "text-amber-400",
                        ERROR: "text-red-400",
                      };
                      return (
                        <motion.div
                          key={log.timestamp + log.service + index}
                          initial={{ opacity: 0, x: -15, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: "auto" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start space-x-1.5 text-slate-400 select-none overflow-hidden"
                        >
                          <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                          <span className={`font-bold shrink-0 ${badgeColors[log.level]}`}>[{log.level}]</span>
                          <span className="text-cyan-400 shrink-0 font-bold">&lt;{log.service}&gt;</span>
                          <span className="truncate text-slate-300">{log.message}</span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================================
            ABOUT: SYSTEM SPECIFICATIONS & ARCHITECTURE BLUEPRINT
           ============================================================================ */}
        <section id="about" className="scroll-mt-20">
          <div className="border border-slate-800 bg-[#020203]/80 p-6 md:p-8 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-800 to-transparent opacity-80" />
            <div className="absolute top-0 right-10 bottom-0 w-[1px] bg-slate-900/40 pointer-events-none" />
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-white text-base md:text-lg font-bold tracking-tight">OPERATOR SPECIFICATIONS & ARCHITECTURE</h2>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">DOSSIER HARSH_KUMAR // MISSION STATEMENT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* DESCRIPTION & DEVOPS PHILOSOPHY (7 COLS) */}
              <div className="lg:col-span-7 space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  I operate as a <strong className="text-emerald-400 font-bold">Principal DevOps & Cloud Infrastructure Architect</strong> specializing in the lifecycle management of complex cloud infrastructure. I engineer high-availability server networks, build fast, audit-passing build pipelines, and embed robust multi-layered telemetry logs deep within target containers.
                </p>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  My design philosophy is simple: <span className="text-white">Infrastructure must be written entirely as software (IaC)</span>, managed via strict GitOps policies, protected with tight zero-trust security bounds, and fully mapped with trace metrics so that cluster failures are predicted and automated away before they can register.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <div className="p-1 bg-emerald-500/10 rounded text-emerald-400 shrink-0 mt-0.5">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-white font-bold block mb-0.5">High-Availability Topology</span>
                      <p className="text-slate-400 text-[11px]">Multi-AZ database and container distribution, removing any Single Point of Failure (SPOF).</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="p-1 bg-cyan-500/10 rounded text-cyan-400 shrink-0 mt-0.5">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-white font-bold block mb-0.5">Zero-Trust & Vault Security</span>
                      <p className="text-slate-400 text-[11px]">Enforcing least-privilege IAM specs, encrypted static files, and secrets isolation.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="p-1 bg-amber-500/10 rounded text-amber-400 shrink-0 mt-0.5">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-white font-bold block mb-0.5">End-To-End Observability</span>
                      <p className="text-slate-400 text-[11px]">Ingesting comprehensive service logs, CPU telemetry, network rates, and APM latency tracing.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="p-1 bg-purple-500/10 rounded text-purple-400 shrink-0 mt-0.5">
                      <Workflow className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-white font-bold block mb-0.5">Declarative GitOps Pipelines</span>
                      <p className="text-slate-400 text-[11px]">Empowering continuous integration via direct source-control synchronization steps.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLUEPRINT SCHEMATIC (5 COLS) */}
              <div className="lg:col-span-5 bg-black/40 border border-slate-900 p-5 rounded-md text-[11px] leading-relaxed relative overflow-hidden">
                <div className="absolute top-2 right-2 flex space-x-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">BLUEPRINT SCHEMA</span>
                </div>
                
                <p className="text-slate-400 font-bold mb-3 border-b border-slate-900 pb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <Code className="h-3.5 w-3.5 text-slate-400" />
                  system-architecture-specification.json
                </p>

                <div className="font-mono text-slate-300 space-y-1.5 overflow-x-auto">
                  <div className="text-emerald-400">{`{`}</div>
                  <div className="pl-4"><span className="text-cyan-400">&quot;operator_alias&quot;</span>: <span className="text-amber-400">&quot;Harsh Kumar&quot;</span>,</div>
                  <div className="pl-4"><span className="text-cyan-400">&quot;mission_focus&quot;</span>: <span className="text-amber-400">&quot;Automation & Resilience&quot;</span>,</div>
                  <div className="pl-4"><span className="text-cyan-400">&quot;primary_platform&quot;</span>: <span className="text-amber-400">&quot;Amazon Web Services (AWS)&quot;</span>,</div>
                  <div className="pl-4">
                    <span className="text-cyan-400">&quot;cluster_orchestrator&quot;</span>: <span className="text-amber-400">&quot;Kubernetes v1.30&quot;</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-cyan-400">&quot;infrastructure_as_code&quot;</span>: <span className="text-emerald-400">true</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-cyan-400">&quot;continuous_delivery&quot;</span>: <span className="text-amber-400">&quot;GitOps via ArgoCD&quot;</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-cyan-400">&quot;observability_coverage&quot;</span>: <span className="text-emerald-400">98.5</span>
                  </div>
                  <div className="text-emerald-400">{`}`}</div>
                </div>

                <div className="border-t border-slate-900 mt-4 pt-3 flex items-center justify-between text-[10px] text-slate-500 select-none">
                  <span>SHA256: 4b97f1da8b9...</span>
                  <span className="text-emerald-500 font-bold">VERIFIED SIGNATURE</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================================
            SKILLS: TECH STACK CONFIGURATION MATRIX (INTERACTIVE BADGES)
           ============================================================================ */}
        <section id="skills" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SKILLS LEFT PANEL: SKILLS MATRIX & PROGRESS BAR GROUP (7/12 COLS) */}
          <div className="lg:col-span-7 border border-slate-800 bg-[#020203]/80 p-6 rounded-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded">
                  <Sliders className="h-5 w-5 animate-spin" />
                </div>
                <div>
                  <h2 className="text-white text-base md:text-lg font-bold tracking-tight">TECH STACK CONFIGURATION MATRIX</h2>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">ACTIVE COMPETENCIES & REALTIME PROFICIENCY LEVELS</span>
                </div>
              </div>

              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Choose any technical block from our matrix configuration. Clicking on a technology dynamically loads Harsh&apos;s real configuration deployment templates in the companion console.
              </p>

              {/* EXPLICIT SKILL CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {[
                  { name: "AWS", category: "Cloud Platform", rating: 95, color: "emerald" },
                  { name: "Kubernetes", category: "Orchestration", rating: 92, color: "cyan" },
                  { name: "Terraform", category: "IaC Automation", rating: 95, color: "emerald" },
                  { name: "Docker", category: "Containerization", rating: 90, color: "cyan" },
                  { name: "CI/CD", category: "Automated Build", rating: 92, color: "amber" },
                  { name: "Observability", category: "Monitoring Stack", rating: 88, color: "purple" },
                ].map((sk) => {
                  const colorMap = {
                    emerald: "border-emerald-500/20 hover:border-emerald-500 hover:shadow-emerald-500/5 hover:text-emerald-400",
                    cyan: "border-cyan-500/20 hover:border-cyan-500 hover:shadow-cyan-500/5 hover:text-cyan-400",
                    amber: "border-amber-500/20 hover:border-amber-500 hover:shadow-amber-500/5 hover:text-amber-400",
                    purple: "border-purple-500/20 hover:border-purple-500 hover:shadow-purple-500/5 hover:text-purple-400",
                  };
                  const activeGlow = selectedSkillSnippet === sk.name ? "border-emerald-500 bg-emerald-500/5 text-emerald-400" : "border-slate-900 bg-slate-950/20 text-slate-300";

                  return (
                    <button
                      key={sk.name}
                      onClick={() => setSelectedSkillSnippet(sk.name)}
                      className={`p-3 border rounded text-left transition-all hover:-translate-y-0.5 duration-200 cursor-pointer ${activeGlow} ${colorMap[sk.color as keyof typeof colorMap]}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs">{sk.name}</span>
                        <span className="text-[9px] font-semibold text-slate-500">{sk.rating}%</span>
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase block tracking-wider truncate">{sk.category}</span>
                      <div className="h-1 bg-slate-950 rounded overflow-hidden mt-2">
                        <div style={{ width: `${sk.rating}%` }} className="h-full bg-emerald-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK TELEMETRY DETAILS */}
            <div className="border-t border-slate-900 mt-6 pt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-[10px] text-slate-500">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>ALL METRICS FULLY ALIGNED & COMPATIBLE WITH GITOPS PROTOCOLS</span>
              </div>
              <div className="flex items-center space-x-3">
                <span>RESOURCES RUN: ACTIVE</span>
                <span>HEALTH: OK</span>
              </div>
            </div>
          </div>

          {/* SKILLS RIGHT PANEL: DYNAMIC INTERACTIVE CONFIGURATION SOURCE (5/12 COLS) */}
          <div className="lg:col-span-5 border border-slate-800 bg-black/90 rounded-lg overflow-hidden flex flex-col justify-between min-h-[380px]">
            
            {/* COMPANION EDITOR BANNER */}
            <div className="bg-[#05070a] px-4 py-3 flex items-center justify-between border-b border-slate-900 text-[11px] font-mono select-none">
              <div className="flex items-center space-x-2 text-slate-400">
                <FileCode className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>
                  payload-snippet-manifest.{SKILL_CODE_SNIPPETS[selectedSkillSnippet]?.language.split(" ")[0] || "txt"}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">READ_ONLY</span>
            </div>

            {/* DYNAMIC CODE EDITOR WINDOW */}
            <div className="flex-1 p-5 overflow-y-auto font-mono text-[11px] leading-relaxed bg-[#010102]/95 crt-effect text-slate-300">
              <pre className="overflow-x-auto whitespace-pre select-all selection:bg-slate-800">
                {SKILL_CODE_SNIPPETS[selectedSkillSnippet]?.code || "Select a competency block to deploy diagnostic templates."}
              </pre>
            </div>

            {/* EDITOR COMPILER FOOTER */}
            <div className="bg-[#05070a]/80 border-t border-slate-900 px-4 py-2 flex items-center justify-between text-[9px] text-slate-500 select-none">
              <span>MANIFEST_SYNTAX: {SKILL_CODE_SNIPPETS[selectedSkillSnippet]?.language || "PLAINTEXT"}</span>
              <span className="text-cyan-400">STATUS: INGESTED_SUCCESSFULLY</span>
            </div>
          </div>
        </section>

        {/* ============================================================================
            PIPELINE: CAREER INTERACTIVE TIMELINE (CI/CD PIPELINE DESIGN)
           ============================================================================ */}
        <section id="pipeline" className="scroll-mt-20 border border-slate-800 bg-[#020203]/80 p-6 md:p-8 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-800 to-transparent" />
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-white text-base md:text-lg font-bold tracking-tight">CAREER RECONSTRUCTION PIPELINE</h2>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">CHRONOLOGICAL PROFESSIONAL MILESTONES AS A RUNNING CI/CD RUNNER</span>
            </div>
          </div>

          <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
            Hover or click over any running stage runner nodes of Harsh&apos;s professional timeline logs to inspect specific titles, company parameters, timelines, and primary accomplishments.
          </p>

          {/* VISUAL PIPELINE GRAPH */}
          <div className="bg-black/40 border border-slate-900 rounded-lg p-5 mb-6">
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-2 max-w-4xl mx-auto py-4">
              
              {/* CONNECTING PIPELINE TUBE BACKGROUND */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-900 -translate-y-1/2 hidden sm:block z-0" />
              
              {PIPELINE_TIMELINE.map((step, idx) => {
                const isActive = selectedTimelineIndex === idx;
                const statusTheme = step.status === "SUCCESS" 
                  ? "bg-emerald-500 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10" 
                  : "bg-purple-500 border-purple-500/30 text-purple-400 shadow-purple-500/10 animate-pulse";
                
                const hoverBorder = step.status === "SUCCESS"
                  ? "hover:border-emerald-400"
                  : "hover:border-purple-400";

                return (
                  <button
                    key={step.stage}
                    onClick={() => setSelectedTimelineIndex(idx)}
                    className={`relative flex flex-col items-center group z-10 cursor-pointer focus:outline-none`}
                  >
                    {/* RUNNING STEP COUNTER */}
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 select-none">
                      STAGE_0{idx+1}
                    </div>

                    {/* MAIN NODE BUTTON */}
                    <div className={`h-12 w-12 rounded-full border bg-black flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${isActive ? "scale-110 border-white ring-2 ring-emerald-500/20" : "border-slate-800 " + hoverBorder}`}>
                      {step.status === "SUCCESS" ? (
                        <Check className={`h-5 w-5 text-emerald-500 ${isActive ? "scale-110" : ""}`} />
                      ) : (
                        <RefreshCw className="h-5 w-5 text-purple-400 animate-spin" />
                      )}
                    </div>

                    {/* STAGE DESCRIPTION NAME */}
                    <span className={`text-[11px] font-bold mt-2 tracking-wide uppercase transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                      {step.stage}
                    </span>

                    {/* METRIC CHIP */}
                    <div className="mt-1 flex items-center space-x-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${step.status === "SUCCESS" ? "bg-emerald-500" : "bg-purple-500"}`} />
                      <span className="text-[8px] font-mono font-bold text-slate-500 tracking-tight">{step.status}</span>
                    </div>
                  </button>
                );
              })}

            </div>
          </div>

          {/* ACTIVE PIPELINE RUN LOGS BOX */}
          <div className="bg-black border border-slate-900 rounded-md p-5 min-h-[220px] flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* DETAILS TITLE */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-2.5 gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">
                    [STAGE: {PIPELINE_TIMELINE[selectedTimelineIndex]?.stage}]
                  </span>
                  <h3 className="text-white text-sm font-bold tracking-tight">
                    {PIPELINE_TIMELINE[selectedTimelineIndex]?.role}
                  </h3>
                  <span className="text-slate-500 text-xs shrink-0 select-none">
                    @ {PIPELINE_TIMELINE[selectedTimelineIndex]?.company}
                  </span>
                </div>
                <div className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-cyan-400 font-mono rounded text-[10px]">
                  ⏱️ {PIPELINE_TIMELINE[selectedTimelineIndex]?.period}
                </div>
              </div>

              {/* OVERALL STAGE INFO */}
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed pl-1.5 border-l-2 border-slate-800 italic">
                &quot;{PIPELINE_TIMELINE[selectedTimelineIndex]?.description}&quot;
              </p>

              {/* STAGE STEPS LOGS */}
              <div className="space-y-1.5 pl-1.5">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider block mb-1">
                  DETAILED ACTION EXECUTION LOGS:
                </span>
                {PIPELINE_TIMELINE[selectedTimelineIndex]?.achievements.map((item, idx) => (
                  <div key={idx} className="flex items-start text-xs space-x-2 text-slate-400 font-mono leading-relaxed">
                    <span className="text-emerald-500 shrink-0 select-none">✔ [log-{idx+1}]</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* STAGE FOOTER TECH TAGS */}
            <div className="border-t border-slate-900 mt-5 pt-3.5 flex flex-wrap gap-1.5 items-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest shrink-0 font-bold mr-1">STACK APPLIED:</span>
              {PIPELINE_TIMELINE[selectedTimelineIndex]?.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-slate-950 border border-slate-900 hover:border-cyan-500/20 text-cyan-400 font-mono rounded text-[10px] transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </section>

        {/* ============================================================================
            PROJECTS: ACTIVE DEPLOYMENTS GRID (DETAILED SERVICE CARDS)
           ============================================================================ */}
        <section id="projects" className="scroll-mt-20 space-y-6">
          
          {/* SECTION HEADER */}
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
              <Server className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white text-base md:text-lg font-bold tracking-tight">ACTIVE OPERATIONAL DEPLOYMENTS</h2>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">PROD-ENV WORKLOADS AND DESIGN MANIFESTS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PROJECT CARD 1: MULTI-REGION K8S CLUSTER */}
            <div className="border border-slate-800 bg-[#020203]/90 rounded-lg overflow-hidden flex flex-col justify-between shadow-xl relative group">
              <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-800 to-transparent" />
              
              <div className="p-5 md:p-6 space-y-4">
                
                {/* HEAD & REGION */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-tight">Multi-Region K8s Cluster Automation</h3>
                    <span className="text-[9px] text-slate-500 font-semibold tracking-wider block uppercase">RESOURCE_ID: cluster.eks-prod-main</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                    DEPLOYED
                  </span>
                </div>

                {/* TEXT */}
                <p className="text-slate-300 text-xs leading-relaxed font-mono">
                  Automated modular orchestrator provisioning of highly available Kubernetes (EKS/GKE) clusters using modular infrastructure-as-code modules. Cluster synchronization and application deployments governed strictly by declarative ArgoCD GitOps pipelines, enforcing continuous deployment practices.
                </p>

                {/* SIMULATED SYSTEM LIVE WAVES */}
                <div className="bg-black/50 p-2.5 border border-slate-900 rounded font-mono text-[10px] space-y-1.5 select-none relative overflow-hidden">
                  <div className="flex justify-between items-center text-[9px] text-slate-500 mb-1">
                    <span>GITOPS SYNC METRIC FEED</span>
                    <span className="text-emerald-400">SYNCED OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-600">Sync load:</span>
                    <div className="flex-1 flex items-end h-5 gap-0.5 mt-0.5">
                      {[15, 25, 45, 12, 10, 8, 30, 45, 60, 50, 40, 75, 90, 80, 55, 68, 50, 40, 30, 12, 8, 25, 30, 45, 35, 12].map((v, i) => (
                        <div
                          key={i}
                          style={{ height: `${v}%` }}
                          className="flex-1 bg-emerald-500/30 rounded-t"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ARCHITECTURE PROPERTIES */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="bg-black/40 border border-slate-900/60 p-2 rounded">
                    <span className="text-slate-500 block">K8S MASTER NODE:</span>
                    <span className="text-slate-300 font-bold">AWS EKS v1.30</span>
                  </div>
                  <div className="bg-black/40 border border-slate-900/60 p-2 rounded">
                    <span className="text-slate-500 block">ACTIVE HOSTS:</span>
                    <span className="text-emerald-400 font-bold">24 Nodes (Spot/On-dem)</span>
                  </div>
                  <div className="bg-black/40 border border-slate-900/60 p-2 rounded">
                    <span className="text-slate-500 block">CONTAINERS RUNNING:</span>
                    <span className="text-slate-300 font-bold">500+ active pods</span>
                  </div>
                  <div className="bg-black/40 border border-slate-900/60 p-2 rounded">
                    <span className="text-slate-500 block">RECONCILIATION SLA:</span>
                    <span className="text-cyan-400 font-bold">99.99% Guaranteed</span>
                  </div>
                </div>

              </div>

              {/* CARD FOOTER LINKS */}
              <div className="bg-slate-950/60 border-t border-slate-900 px-5 py-3 flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-slate-500 uppercase">IaC STACK: TF, Helm, Bash</span>
                <div className="flex items-center space-x-4">
                  <a href="https://github.com/harshkumar-devops/multi-region-eks-ops" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors">
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>Source</span>
                  </a>
                  <span className="text-slate-800">|</span>
                  <a href="https://argocd.harshkumar.online" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 transition-colors">
                    <span>ArgoCD Ingress</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* PROJECT CARD 2: HIGH-AVAILABILITY MICROSERVICES */}
            <div className="border border-slate-800 bg-[#020203]/90 rounded-lg overflow-hidden flex flex-col justify-between shadow-xl relative group">
              <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-800 to-transparent" />
              
              <div className="p-5 md:p-6 space-y-4">
                
                {/* HEAD & REGION */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-tight">High-Availability Microservices Topology</h3>
                    <span className="text-[9px] text-slate-500 font-semibold tracking-wider block uppercase">RESOURCE_ID: stack.aws-prod-mesh</span>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 text-[9px] font-bold uppercase tracking-wider">
                    DEPLOYED
                  </span>
                </div>

                {/* TEXT */}
                <p className="text-slate-300 text-xs leading-relaxed font-mono">
                  Designed, configured and deployed a bulletproof resilient architecture on AWS utilizing Application Load Balancers, complex EC2 Auto Scaling groups, secure RDS multi-AZ databases, and complete Datadog/Prometheus monitoring. Slashed incident MTTR from 45 minutes down to under 3.
                </p>

                {/* SIMULATED SYSTEM LIVE WAVES */}
                <div className="bg-black/50 p-2.5 border border-slate-900 rounded font-mono text-[10px] space-y-1.5 select-none relative overflow-hidden">
                  <div className="flex justify-between items-center text-[9px] text-slate-500 mb-1">
                    <span>HTTP TRAFFIC LATENCY APM</span>
                    <span className="text-cyan-400">LATENCY: 12ms (AVG)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-600">Latency:</span>
                    <div className="flex-1 flex items-end h-5 gap-0.5 mt-0.5">
                      {[10, 12, 11, 14, 15, 12, 10, 8, 11, 13, 14, 12, 45, 60, 32, 15, 12, 11, 10, 9, 11, 12, 13, 15, 14, 12].map((v, i) => (
                        <div
                          key={i}
                          style={{ height: `${v}%` }}
                          className="flex-1 bg-cyan-500/30 rounded-t"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ARCHITECTURE PROPERTIES */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="bg-black/40 border border-slate-900/60 p-2 rounded">
                    <span className="text-slate-500 block">AWS GATEWAY ROUTING:</span>
                    <span className="text-slate-300 font-bold">AWS ALB + Route53 Geo</span>
                  </div>
                  <div className="bg-black/40 border border-slate-900/60 p-2 rounded">
                    <span className="text-slate-500 block">DB NODE STATUS:</span>
                    <span className="text-emerald-400 font-bold">PostgreSQL Multi-AZ</span>
                  </div>
                  <div className="bg-black/40 border border-slate-900/60 p-2 rounded">
                    <span className="text-slate-500 block">OBSERVABILITY TOOLING:</span>
                    <span className="text-slate-300 font-bold">Datadog APM, Prometheus</span>
                  </div>
                  <div className="bg-black/40 border border-slate-900/60 p-2 rounded">
                    <span className="text-slate-500 block">STABILIZED SLA:</span>
                    <span className="text-cyan-400 font-bold">99.999% Guaranteed</span>
                  </div>
                </div>

              </div>

              {/* CARD FOOTER LINKS */}
              <div className="bg-slate-950/60 border-t border-slate-900 px-5 py-3 flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-slate-500 uppercase">IaC STACK: AWS VPC, RDS, Datadog</span>
                <div className="flex items-center space-x-4">
                  <a href="https://github.com/harshkumar-devops/ha-microservices-infrastructure" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors">
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>Source</span>
                  </a>
                  <span className="text-slate-800">|</span>
                  <a href="https://monitoring.harshkumar.online" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 transition-colors">
                    <span>APM Dashboard</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================================
            CONTACT: REST API PAYLOAD SUBMISSION (JSON-BASED GATEWAY)
           ============================================================================ */}
        <section id="contact" className="scroll-mt-20">
          <div className="border border-slate-800 bg-[#020203]/80 p-6 md:p-8 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-800 to-transparent" />
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-white text-base md:text-lg font-bold tracking-tight">REST API CONTACT GATEWAY</h2>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">POST_REQUEST MANIFEST // SECURE CALLBACK SECRETS EXCHANGE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* REST CLIENT INPUT FORM (7/12 COLS) */}
              <div className="lg:col-span-7">
                {!formSuccess ? (
                  <form onSubmit={handleSendForm} className="space-y-4 font-mono text-xs">
                    <p className="text-slate-300 leading-relaxed text-xs">
                      Submit an HTTP/gRPC request packet containing your contact details. This executes a serverless payload queue that notifies Harsh in real time.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase text-[10px]">SENDER_IDENTITY_TAG:</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name (e.g. John Doe)"
                          value={formName}
                          onChange={(e) => setNameAndPropagate(e.target.value)}
                          className="w-full bg-black border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-amber-500/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase text-[10px]">CALLBACK_URI_ENDPOINT:</label>
                        <input
                          type="email"
                          required
                          placeholder="Your Email (e.g. callback@example.com)"
                          value={formEmail}
                          onChange={(e) => setEmailAndPropagate(e.target.value)}
                          className="w-full bg-black border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-amber-500/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-bold uppercase text-[10px]">POST_PAYLOAD_BODY:</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Configure your payload message here..."
                        value={formMsg}
                        onChange={(e) => setMsgAndPropagate(e.target.value)}
                        className="w-full bg-black border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-amber-500/50 transition-colors resize-none"
                      />
                    </div>

                    {/* ACTION SUBMIT BUTTON */}
                    <div className="flex items-center space-x-3 pt-1">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500 hover:text-black font-bold text-amber-400 text-xs rounded transition-all cursor-pointer flex items-center space-x-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>SEND POST_PAYLOAD</span>
                      </button>
                      
                      <span className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">
                        METHOD: HTTP POST /v1/contact
                      </span>
                    </div>

                    {/* LOADER TELEMETRY STREAM */}
                    {formSubmitting && (
                      <div className="bg-black/60 border border-slate-900 p-3 rounded font-mono text-[10px] space-y-1.5">
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>STREAMING DISPATCH CHANNELS:</span>
                          <span className="text-amber-400 animate-pulse">{formProgress}% IN PROGRESS</span>
                        </div>
                        <div className="h-1 bg-slate-950 rounded overflow-hidden">
                          <div style={{ width: `${formProgress}%` }} className="h-full bg-amber-500 transition-all duration-300" />
                        </div>
                        <div className="space-y-0.5 text-slate-500 max-h-[80px] overflow-y-auto pt-1">
                          {formLog.map((log, idx) => (
                            <div key={idx} className="flex items-center space-x-1">
                              <span className="text-amber-500 shrink-0">✔</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="space-y-4 font-mono text-xs border border-emerald-500/20 bg-emerald-500/5 p-6 rounded-md">
                    <div className="flex items-center space-x-2.5 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6 shrink-0" />
                      <div>
                        <span className="font-bold text-sm block">HTTP/1.1 202 ACCEPTED</span>
                        <span className="text-[10px] text-emerald-400/70 uppercase">PAYLOAD TRANSMITTED & QUEUED SUCCESSFULLY</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 leading-relaxed pl-1">
                      Thank you! Your connection packets successfully traversed our ingress path. The cloud micro-queue database has indexed your payload, and Harsh Kumar has been notified via alert hook.
                    </p>

                    <div className="bg-black/60 border border-slate-900/60 p-3 rounded text-[11px] font-mono text-slate-400 space-y-1">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider mb-1">API SERVERLESS RESPONSE JSON:</span>
                      <div>{`{`}</div>
                      <div className="pl-4"><span className="text-cyan-400">&quot;status&quot;</span>: <span className="text-emerald-400">202</span>,</div>
                      <div className="pl-4"><span className="text-cyan-400">&quot;uuid&quot;</span>: <span className="text-amber-400">&quot;{Math.random().toString(36).substr(2, 9)}&quot;</span>,</div>
                      <div className="pl-4"><span className="text-cyan-400">&quot;message&quot;</span>: <span className="text-amber-400">&quot;Connection established. Harsh will respond back on Callback URI shortly.&quot;</span></div>
                      <div>{`}`}</div>
                    </div>

                    <button
                      onClick={resetForm}
                      className="px-3 py-1.5 border border-slate-800 hover:border-slate-600 bg-slate-950 text-slate-300 hover:text-white rounded text-[11px] transition-colors font-semibold font-mono cursor-pointer"
                    >
                      CLEAR_AND_RESET_CLIENT
                    </button>
                  </div>
                )}
              </div>

              {/* REST CLIENT JSON VISUALIZER (5/12 COLS) */}
              <div className="lg:col-span-5 bg-black/40 border border-slate-900 p-5 rounded-md text-[11px] leading-relaxed relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest">LIVE STREAM RAW</span>
                  </div>

                  <p className="text-slate-400 font-bold mb-3 border-b border-slate-900 pb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    contact-api-payload.json
                  </p>

                  <div className="font-mono text-slate-300 space-y-1.5 overflow-x-auto">
                    <div className="text-amber-500">{`{`}</div>
                    <div className="pl-4">
                      <span className="text-cyan-400">&quot;sender_identity_tag&quot;</span>:{" "}
                      <span className="text-amber-400">&quot;{formName || "null"}&quot;</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-cyan-400">&quot;callback_uri_endpoint&quot;</span>:{" "}
                      <span className="text-amber-400">&quot;{formEmail || "null"}&quot;</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-cyan-400">&quot;post_payload_body&quot;</span>:{" "}
                      <span className="text-amber-400">&quot;{formMsg || "null"}&quot;</span>
                    </div>
                    <div className="text-amber-500">{`}`}</div>
                  </div>
                </div>

                <div className="border-t border-slate-900 mt-6 pt-3 flex items-center justify-between text-[10px] text-slate-500 select-none">
                  <span>METHOD: POST</span>
                  <span>ENCTYPE: application/json</span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ============================================================================
          SYSTEM FOOTER
         ============================================================================ */}
      <footer className="border-t border-slate-900 bg-[#020203] px-4 py-6 text-xs text-slate-500 tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono">
          
          {/* CLIENT IP MOCK BANNER */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center md:justify-start">
            <span>© {mounted ? new Date().getFullYear() : "2026"} Harsh Kumar</span>
            <span className="hidden sm:inline text-slate-800">|</span>
            <span>NODE_IP: <span className="text-slate-400">172.24.112.5</span></span>
            <span className="hidden sm:inline text-slate-800">|</span>
            <span>TIMEZONE: <span className="text-slate-400">{timezoneStr}</span></span>
          </div>

          {/* SOCIAL WEBHOOK ENTRANCES */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/harshkumar-devops"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-emerald-400 flex items-center space-x-1 transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GITHUB</span>
            </a>
            <span className="text-slate-800">|</span>
            <a
              href="https://linkedin.com/in/harshkumar-devops"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyan-400 flex items-center space-x-1 transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
              <span>LINKEDIN</span>
            </a>
            <span className="text-slate-800">|</span>
            <a
              href="mailto:harsh.kumar.devops@gmail.com"
              className="text-slate-500 hover:text-amber-400 flex items-center space-x-1 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>EMAIL</span>
            </a>
          </div>

        </div>
      </footer>
    </div>
  );

  // Helper form functions
  function setNameAndPropagate(val: string) {
    setFormName(val);
  }
  
  function setEmailAndPropagate(val: string) {
    setFormEmail(val);
  }

  function setMsgAndPropagate(val: string) {
    setFormMsg(val);
  }
}
