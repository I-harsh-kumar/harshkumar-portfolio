// Terminal Portfolio Logic
// Author: Harsh Kumar (DevOps & Cloud Engineer)

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const terminalBody = document.getElementById("terminal-body");
  const terminalOutput = document.getElementById("terminal-output");
  const terminalInput = document.getElementById("terminal-input");
  const inputRow = document.getElementById("input-row");
  const headerUptime = document.getElementById("header-uptime");
  const metricCpu = document.getElementById("metric-cpu");
  const metricCpuBar = document.getElementById("metric-cpu-bar");
  const metricRam = document.getElementById("metric-ram");
  const metricRamBar = document.getElementById("metric-ram-bar");
  const metricPing = document.getElementById("metric-ping");
  const footerLatency = document.getElementById("footer-latency");
  const dashboardLogs = document.getElementById("dashboard-logs");
  const btnPing = document.getElementById("btn-ping");
  const btnScale = document.getElementById("btn-scale");

  // Command History
  let commandHistory = [];
  let historyIndex = -1;

  // Available commands
  const commandsList = ["whoami", "history", "projects", "contact", "cloud-status", "neofetch", "help", "clear"];

  // Custom data for commands
  const portfolioData = {
    whoami: `
<div class="space-y-2">
  <p class="text-white font-bold text-base">Harsh Kumar</p>
  <p class="text-terminal-lightGreen font-semibold">DevOps & Cloud Platform Engineer</p>
  <p class="text-zinc-300 leading-relaxed max-w-2xl">
    I architect, secure, and scale high-performance cloud infrastructure. Specializing in cloud-native technologies, GitOps workflows, automation pipelines, and Kubernetes orchestrations that run workloads seamlessly across AWS, GCP, and bare metal.
  </p>
  <div class="flex flex-wrap gap-2 pt-1">
    <span class="bg-terminal-green/10 border border-terminal-green/30 text-terminal-lightGreen text-2xs px-2 py-0.5 rounded">AWS Certified Solutions Architect</span>
    <span class="bg-terminal-green/10 border border-terminal-green/30 text-terminal-lightGreen text-2xs px-2 py-0.5 rounded">Certified Kubernetes Administrator (CKA)</span>
    <span class="bg-terminal-green/10 border border-terminal-green/30 text-terminal-lightGreen text-2xs px-2 py-0.5 rounded">HashiCorp Terraform Associate</span>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400 pt-2">
    <div><span class="text-terminal-lightGreen font-semibold">⚡ Primary Tech:</span> Kubernetes, Terraform, AWS, Docker, Linux, Bash</div>
    <div><span class="text-terminal-lightGreen font-semibold">⚙️ CI/CD & Ops:</span> GitHub Actions, GitLab CI, ArgoCD, Prometheus, Grafana</div>
  </div>
</div>
    `,
    history: `
<div class="space-y-3">
  <p class="text-white font-bold border-b border-terminal-green/20 pb-1">PROFESSIONAL TIMELINE & EXPERIENCE MILESTONES</p>
  
  <div class="relative border-l border-terminal-green/30 ml-2 pl-4 space-y-4">
    <!-- Milestone 1 -->
    <div class="relative">
      <span class="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-terminal-green border-2 border-terminal-black"></span>
      <p class="text-terminal-lightGreen font-bold text-xs">Lead DevOps Engineer | CloudScale Inc. (2024 - Present)</p>
      <p class="text-zinc-400 text-xs">Optimized CI/CD builds scaling to 400+ developers. Managed multi-region EKS clusters resulting in 99.99% system availability.</p>
      <p class="text-zinc-500 text-3xs">Stack: AWS, Terraform, ArgoCD, Kubernetes, Prometheus, Datadog</p>
    </div>

    <!-- Milestone 2 -->
    <div class="relative">
      <span class="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-terminal-green border-2 border-terminal-black"></span>
      <p class="text-terminal-lightGreen font-bold text-xs">Cloud Infrastructure Engineer | GlobalOps Solutions (2022 - 2024)</p>
      <p class="text-zinc-400 text-xs">Migrated monolithic on-prem infrastructure to containerized microservices on AWS, reducing operational overhead by 35%.</p>
      <p class="text-zinc-500 text-3xs">Stack: AWS, Docker, GitHub Actions, Terraform, Python, Helm</p>
    </div>

    <!-- Milestone 3 -->
    <div class="relative">
      <span class="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-terminal-green border-2 border-terminal-black"></span>
      <p class="text-terminal-lightGreen font-bold text-xs">Systems Engineer | TechKernel Networks (2020 - 2022)</p>
      <p class="text-zinc-400 text-xs">Managed enterprise Linux server fleet. Automated system configurations, audits, and security patching with Ansible.</p>
      <p class="text-zinc-500 text-3xs">Stack: RHEL/CentOS, Ansible, Bash scripting, Jenkins, Nginx</p>
    </div>
  </div>
</div>
    `,
    projects: `
<div class="space-y-3">
  <p class="text-white font-bold border-b border-terminal-green/20 pb-1">SELECTED DEVOPS & INFRASTRUCTURE PROJECTS</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
    
    <!-- Project 1 -->
    <div class="bg-terminal-card p-3 rounded border border-terminal-green/20 hover:border-terminal-green/50 transition">
      <p class="text-terminal-lightGreen font-bold flex justify-between">
        <span>📦 kube-gitops-boilerplate</span>
        <span class="text-3xs bg-terminal-green/10 px-1 rounded text-white">Active</span>
      </p>
      <p class="text-zinc-400 text-xs mt-1">Ready-to-deploy GitOps repository using ArgoCD, Sealed Secrets, and Cert-Manager on EKS.</p>
      <p class="text-zinc-500 text-3xs mt-2">Terraform • ArgoCD • EKS • Kubernetes</p>
      <a href="https://github.com" target="_blank" class="text-terminal-lightGreen hover:underline text-3xs mt-2 inline-block">→ View Repository</a>
    </div>

    <!-- Project 2 -->
    <div class="bg-terminal-card p-3 rounded border border-terminal-green/20 hover:border-terminal-green/50 transition">
      <p class="text-terminal-lightGreen font-bold flex justify-between">
        <span>📊 prom-grafana-devops-stack</span>
        <span class="text-3xs bg-terminal-green/10 px-1 rounded text-white">Featured</span>
      </p>
      <p class="text-zinc-400 text-xs mt-1">Pre-configured monitoring suite with customized alerting rules and dynamic performance dashboards for Kubernetes.</p>
      <p class="text-zinc-500 text-3xs mt-2">Prometheus • Grafana • Alertmanager • Helm</p>
      <a href="https://github.com" target="_blank" class="text-terminal-lightGreen hover:underline text-3xs mt-2 inline-block">→ View Repository</a>
    </div>

    <!-- Project 3 -->
    <div class="bg-terminal-card p-3 rounded border border-terminal-green/20 hover:border-terminal-green/50 transition">
      <p class="text-terminal-lightGreen font-bold flex justify-between">
        <span>🚀 multi-cloud-tf-module</span>
        <span class="text-3xs bg-terminal-green/10 px-1 rounded text-white">Open Source</span>
      </p>
      <p class="text-zinc-400 text-xs mt-1">Reusable Terraform modules for provisioning highly available VPCs and private subnets across AWS and GCP.</p>
      <p class="text-zinc-500 text-3xs mt-2">Terraform • AWS • GCP • CI/CD Pipelines</p>
      <a href="https://github.com" target="_blank" class="text-terminal-lightGreen hover:underline text-3xs mt-2 inline-block">→ View Repository</a>
    </div>

    <!-- Project 4 -->
    <div class="bg-terminal-card p-3 rounded border border-terminal-green/20 hover:border-terminal-green/50 transition">
      <p class="text-terminal-lightGreen font-bold flex justify-between">
        <span>🎮 terminal-isometric-sim</span>
        <span class="text-3xs bg-terminal-green/10 px-1 rounded text-white">3D WebGL</span>
      </p>
      <p class="text-zinc-400 text-xs mt-1">An interactive 3D WebGL application rendering virtual cloud data centers and network routing paths in real-time.</p>
      <p class="text-zinc-500 text-3xs mt-2">Three.js • WebGL • TailwindCSS • Javascript</p>
      <a href="https://github.com" target="_blank" class="text-terminal-lightGreen hover:underline text-3xs mt-2 inline-block">→ View Project Demo</a>
    </div>

  </div>
</div>
    `,
    contact: `
<div class="space-y-2">
  <p class="text-white font-bold">CONNECT WITH ME (SECURE SSH/HTTPS ENDPOINTS)</p>
  <p class="text-zinc-400 text-xs">Reach out to establish a network handshake:</p>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
    <div class="flex items-center space-x-2">
      <span class="text-terminal-lightGreen font-semibold">📧 Email:</span>
      <a href="mailto:harsh@example.com" class="text-white hover:text-terminal-lightGreen hover:underline">harsh@example.com</a>
    </div>
    <div class="flex items-center space-x-2">
      <span class="text-terminal-lightGreen font-semibold">🌐 GitHub:</span>
      <a href="https://github.com" target="_blank" class="text-white hover:text-terminal-lightGreen hover:underline">github.com/harsh-kumar-dev</a>
    </div>
    <div class="flex items-center space-x-2">
      <span class="text-terminal-lightGreen font-semibold">💼 LinkedIn:</span>
      <a href="https://linkedin.com" target="_blank" class="text-white hover:text-terminal-lightGreen hover:underline">linkedin.com/in/harshkumar-devops</a>
    </div>
    <div class="flex items-center space-x-2">
      <span class="text-terminal-lightGreen font-semibold">🐦 Twitter:</span>
      <a href="https://twitter.com" target="_blank" class="text-white hover:text-terminal-lightGreen hover:underline">@harsh_cloudops</a>
    </div>
  </div>
</div>
    `
  };

  // Boot Sequence Message logs
  const bootLogs = [
    { text: "Initializing GRUB bootloader core stage 1.5...", delay: 50 },
    { text: "Loading Linux kernel 6.4.0-sys-harsh...", delay: 100 },
    { text: "Mounting partition ext4 /dev/sda1 on /root... OK", delay: 80 },
    { text: "[ OK ] Mounted virtual filesystems (/proc, /sys, /dev)", delay: 50 },
    { text: "[ OK ] Setting system clock to UTC time standard.", delay: 60 },
    { text: "[ OK ] Initializing eth0: DHCP negotiated, dynamic lease secured.", delay: 120 },
    { text: "[ OK ] Checking system requirements... 4 Cores, 8GB RAM validated.", delay: 70 },
    { text: "[ OK ] Initializing Docker Daemon runtime. Active & Running.", delay: 150 },
    { text: "[ OK ] Connection verified: Kubernetest cluster 'k8s-prod.harshkumar.dev' online.", delay: 110 },
    { text: "[ OK ] Synchronizing Cloudflare DNS configurations.", delay: 80 },
    { text: "Loading user environment variables: guest@harshkumar... LOADED.", delay: 90 },
    { text: "SSH login authenticated on tty1 from 127.0.0.1 (localhost).", delay: 100 },
    { text: "-------------------------------------------------------------", delay: 30 },
    { text: "<span class='text-white font-bold text-base text-glow'>WELCOME TO HARSH KUMAR'S PORTFOLIO CONSOLE (v2.6.2)</span>", delay: 40 },
    { text: "<span class='text-zinc-400'>Type <span class='text-terminal-lightGreen font-bold'>'help'</span> to see all available commands. Try <span class='text-terminal-lightGreen font-bold'>'neofetch'</span> to display system stats.</span>", delay: 40 },
    { text: "-------------------------------------------------------------", delay: 30 }
  ];

  // Run Boot Sequence
  let logIndex = 0;
  function runBootSequence() {
    if (logIndex < bootLogs.length) {
      const currentLog = bootLogs[logIndex];
      writeOutputLine(currentLog.text, true);
      logIndex++;
      setTimeout(runBootSequence, currentLog.delay);
    } else {
      // Show real input prompt and focus
      inputRow.classList.remove("hidden");
      terminalInput.focus();
      scrollToBottom();
    }
  }

  // Trigger Boot Sequence on Page Load
  runBootSequence();

  // Handle Input submission
  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const inputVal = terminalInput.value.trim();
      terminalInput.value = "";

      if (inputVal !== "") {
        // Log to history
        commandHistory.push(inputVal);
        historyIndex = commandHistory.length;

        // Print input path
        writeOutputLine(`<span class="text-terminal-lightGreen font-bold">guest@harshkumar:~$</span> <span class="text-white">${escapeHTML(inputVal)}</span>`, false);

        // Execute command
        executeCommand(inputVal.toLowerCase());
      } else {
        writeOutputLine(`<span class="text-terminal-lightGreen font-bold">guest@harshkumar:~$</span>`, false);
      }
      scrollToBottom();
    } else if (e.key === "ArrowUp") {
      // Navigate History Up
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      // Navigate History Down
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = "";
      }
    } else if (e.key === "Tab") {
      // Tab Autocomplete
      e.preventDefault();
      const currentInput = terminalInput.value.trim();
      if (currentInput !== "") {
        const matches = commandsList.filter(cmd => cmd.startsWith(currentInput));
        if (matches.length === 1) {
          terminalInput.value = matches[0];
        } else if (matches.length > 1) {
          // List matches in the terminal output
          writeOutputLine(`<span class="text-terminal-lightGreen font-bold">guest@harshkumar:~$</span> <span class="text-white">${escapeHTML(terminalInput.value)}</span>`, false);
          writeOutputLine(`<span class="text-terminal-gray">Matches: ${matches.join(", ")}</span>`, true);
          scrollToBottom();
        }
      }
    }
  });

  // Focus input when clicking anywhere on terminal body
  terminalBody.addEventListener("click", () => {
    terminalInput.focus();
  });

  // Utility to write output lines
  function writeOutputLine(htmlContent, isCommandOutput = true) {
    const line = document.createElement("div");
    if (isCommandOutput) {
      line.className = "command-output-line text-zinc-300 leading-relaxed text-xs sm:text-sm";
    } else {
      line.className = "flex items-center text-xs sm:text-sm";
    }
    line.innerHTML = htmlContent;
    terminalOutput.appendChild(line);
  }

  // Escape user strings to prevent HTML injection
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Scroll terminal to bottom
  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Commands Processor
  function executeCommand(cmd) {
    // Check built-in portfolio data first
    if (portfolioData[cmd]) {
      writeOutputLine(portfolioData[cmd]);
      return;
    }

    // Process custom/utility commands
    switch (cmd) {
      case "help":
        showHelp();
        break;
      case "clear":
        terminalOutput.innerHTML = "";
        break;
      case "neofetch":
        showNeofetch();
        break;
      case "cloud-status":
        showTerminalCloudStatus();
        break;
      default:
        writeOutputLine(`<span class="text-red-500">Command not found: '${escapeHTML(cmd)}'. Type 'help' to see all commands.</span>`);
    }
  }

  // Command 'help' output
  function showHelp() {
    const helpText = `
<div class="space-y-2">
  <p class="text-white font-bold">SUPPORTED PORTFOLIO SHELL COMMANDS:</p>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
    <div><span class="text-terminal-lightGreen font-semibold">whoami</span>       - Display professional summary, stack & certs</div>
    <div><span class="text-terminal-lightGreen font-semibold">history</span>      - Display professional experience timeline</div>
    <div><span class="text-terminal-lightGreen font-semibold">projects</span>     - Formatted catalog of open source/3D apps</div>
    <div><span class="text-terminal-lightGreen font-semibold">contact</span>      - Output safe SSH links and profiles</div>
    <div><span class="text-terminal-lightGreen font-semibold">cloud-status</span> - High-fidelity terminal cluster health diagnostics</div>
    <div><span class="text-terminal-lightGreen font-semibold">neofetch</span>     - Display system specs, OS, uptime, and ASCII art</div>
    <div><span class="text-terminal-lightGreen font-semibold">clear</span>        - Flush and reset output buffer</div>
    <div><span class="text-terminal-lightGreen font-semibold">help</span>         - Output available command interfaces</div>
  </div>
</div>
    `;
    writeOutputLine(helpText);
  }

  // Command 'neofetch' output
  function showNeofetch() {
    const neofetchText = `
<div class="flex flex-col sm:flex-row sm:space-x-6 items-start space-y-4 sm:space-y-0">
  <pre class="text-terminal-lightGreen text-2xs md:text-xs leading-none font-bold font-mono">
   _  _                 _     
  | || |__ _ _ _ __ |_| |  
  | __ / _\` | '_(_-< ' \\ |  
  |_||_\\__,_|_| /__/_||_|_|  
  | |/ /_  _ _ __  __ _ _ _ 
  | ' &lt;| || | '  \\/ _\` | '_|
  |_|\\_\\\\_,_|_|_|_|__,_|_|  
  </pre>
  <div class="space-y-1 text-xs">
    <p class="text-white font-bold">guest@harshkumar-devops-01</p>
    <p class="text-terminal-gray">---------------------------</p>
    <p><span class="text-terminal-lightGreen">OS:</span> HarshOps GNU/Linux v2.6</p>
    <p><span class="text-terminal-lightGreen">Kernel:</span> 6.4.0-sys-harsh-prod</p>
    <p><span class="text-terminal-lightGreen">Uptime:</span> <span class="uptime-placeholder">104 days, 12 hours, 45 mins</span></p>
    <p><span class="text-terminal-lightGreen">Shell:</span> bash-5.2.15</p>
    <p><span class="text-terminal-lightGreen">Resolution:</span> Responsive-Canvas (Fluid)</p>
    <p><span class="text-terminal-lightGreen">CPU:</span> AWS Nitro Core (Simulated vCPU)</p>
    <p><span class="text-terminal-lightGreen">Memory:</span> 3.58 GB / 8.00 GB (44.8%)</p>
    <p><span class="text-terminal-lightGreen">Primary Stack:</span> Docker, Terraform, Kubernetes, Helm</p>
  </div>
</div>
    `;
    writeOutputLine(neofetchText);
    
    // Update dynamic uptime inside neofetch output to current uptime
    const currentUptimeText = headerUptime.textContent;
    const placeholders = document.querySelectorAll(".uptime-placeholder");
    placeholders.forEach(el => el.textContent = currentUptimeText);
  }

  // Command 'cloud-status' output
  function showTerminalCloudStatus() {
    const statusText = `
<div class="space-y-2">
  <p class="text-white font-bold">CLUSTER STATUS DIAGNOSTICS REPORT</p>
  <p class="text-terminal-gray">Generated at: ${new Date().toISOString()} | Node Status: operational</p>
  <div class="border border-terminal-green/20 p-2 rounded bg-terminal-black font-mono text-2xs leading-relaxed space-y-1">
    <p><span class="text-terminal-lightGreen font-bold">[EKS MASTER]</span>  k8s-prod.harshkumar.dev - <span class="text-white bg-terminal-darkGreen px-1 rounded">HEALTHY</span> (12ms RTT)</p>
    <p><span class="text-terminal-lightGreen font-bold">[PODS STATUS]</span> 18 Active Pods | 0 Pending | 0 CrashLoopBackOffs</p>
    <p><span class="text-terminal-lightGreen font-bold">[METRIC CPU]</span>  ${metricCpu.textContent} Utilization across nodes</p>
    <p><span class="text-terminal-lightGreen font-bold">[METRIC RAM]</span>  ${metricRam.textContent} total memory footprint reserved</p>
    <p><span class="text-terminal-lightGreen font-bold">[TRAFFIC POP]</span> Route active via Cloudflare POP [IAD]</p>
  </div>
  <p class="text-terminal-lightGreen text-xs">Note: Check the "Cloud Monitor Console" in the right-hand panel for active telemetry and logs.</p>
</div>
    `;
    writeOutputLine(statusText);
  }


  // --- LIVE MONITOR TELEMETRY AND LOG UPDATES ---

  // Uptime Timer Incrementor
  let totalSeconds = 104 * 24 * 3600 + 12 * 3600 + 45 * 60 + 12; // Start time offset
  setInterval(() => {
    totalSeconds++;
    const days = Math.floor(totalSeconds / (24 * 3600));
    let remaining = totalSeconds % (24 * 3600);
    const hours = Math.floor(remaining / 3600);
    remaining = remaining % 3600;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    headerUptime.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);

  // Dynamic Metrics Fluctuations (CPU, RAM, Latency)
  setInterval(() => {
    // CPU: between 10% and 30%
    const cpuVal = (10 + Math.random() * 20).toFixed(1);
    metricCpu.textContent = `${cpuVal}%`;
    metricCpuBar.style.width = `${cpuVal}%`;

    // RAM: between 43% and 47%
    const ramVal = (43 + Math.random() * 4).toFixed(1);
    const ramGB = ((ramVal / 100) * 8).toFixed(2);
    metricRam.textContent = `${ramVal}%`;
    metricRamBar.style.width = `${ramVal}%`;
    // Update RAM GB detail label
    const ramLabel = metricRam.nextElementSibling;
    if (ramLabel) ramLabel.textContent = `${ramGB} / 8 GB`;

    // Latency (Ping): between 11ms and 23ms
    const pingVal = Math.floor(11 + Math.random() * 12);
    metricPing.textContent = `${pingVal} ms`;
    footerLatency.textContent = `${pingVal}`;
  }, 3000);

  // Simulated live event logger
  const dynamicLogTemplates = [
    "[K8s Info] Pod frontend-784f-x291 synced with ReplicaSet.",
    "[API-Gateway] GET /api/v1/projects - 200 OK - 14ms (CF-Cache: HIT)",
    "[Prometheus] Metrics scraped successfully from worker node-01b.",
    "[Healthz] AWS Elastic Load Balancer (ELB) reports 100% target health.",
    "[Nginx-Ingress] TLS Handshake succeeded - TLSv1.3 ECDHE-RSA",
    "[CronJob] database-backup-weekly completed snapshot to AWS S3 bucket.",
    "[K8s Info] Desired replica count matched for Deployment 'postgres-db'.",
    "[ArgoCD-Sync] Repository synchronized successfully to hash commit: bd7492.",
    "[VPC-Flow-Log] Allowed TCP egress traffic to api.github.com on port 443.",
    "[Security-Audit] Vulnerability scanner reports 0 high/critical alerts."
  ];

  function addDashboardLog(text, colorClass = "text-terminal-green/70") {
    const timestamp = new Date().toLocaleTimeString();
    const logItem = document.createElement("div");
    logItem.className = `${colorClass} truncate`;
    logItem.innerHTML = `<span class="text-terminal-gray">[${timestamp}]</span> ${text}`;
    
    dashboardLogs.appendChild(logItem);
    
    // Prune logs if they get too deep to save DOM tree depth
    while (dashboardLogs.children.length > 8) {
      dashboardLogs.removeChild(dashboardLogs.firstChild);
    }
    dashboardLogs.scrollTop = dashboardLogs.scrollHeight;
  }

  // Populate first few logs immediately
  addDashboardLog("Kubelet starting on cluster node-01...");
  addDashboardLog("Mounting AWS EBS PV pvc-93a8-44fb... SUCCESS.");
  addDashboardLog("Kubernetes horizontal autoscaler initialized.");
  addDashboardLog("Ingress controller established route config.");

  // Periodic random events feed
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * dynamicLogTemplates.length);
    addDashboardLog(dynamicLogTemplates[randomIndex]);
  }, 5000);


  // --- INTERACTIVE DEV OPS BUTTON TRIGGERS ---

  // Button Action: Force Ping Nodes
  btnPing.addEventListener("click", () => {
    addDashboardLog("[DIAG] Initiating manual cluster telemetry check...", "text-yellow-400");
    metricPing.textContent = "6 ms";
    footerLatency.textContent = "6";
    
    // Output diagnostics status directly to interactive terminal if it's initialized
    if (!inputRow.classList.contains("hidden")) {
      writeOutputLine(`<span class="text-yellow-400 font-semibold">[MANUAL DIAGNOSTICS HANDSHAKE]</span> Sending ICMP echo packets to core nodes...`);
      writeOutputLine(`→ aws-eks-master-01 (10.0.1.5) : <span class="text-terminal-lightGreen font-semibold">REACHABLE (4ms)</span>`);
      writeOutputLine(`→ aws-eks-worker-01a (10.0.2.14) : <span class="text-terminal-lightGreen font-semibold">REACHABLE (7ms)</span>`);
      writeOutputLine(`→ aws-eks-worker-01b (10.0.2.15) : <span class="text-terminal-lightGreen font-semibold">REACHABLE (5ms)</span>`);
      writeOutputLine(`<span class="text-terminal-lightGreen">Diagnostics execution complete. System healthy.</span>`);
      scrollToBottom();
    }

    setTimeout(() => {
      addDashboardLog("[DIAG] Manual telemetry check COMPLETE. 100% packets routed.", "text-terminal-lightGreen");
    }, 1200);
  });

  // Button Action: Scale Pods (+1)
  let additionalPods = 0;
  btnScale.addEventListener("click", () => {
    additionalPods++;
    const containerSpan = btnScale.closest("aside").querySelector("div:nth-child(1) > div:nth-child(4) > div > span");
    
    addDashboardLog(`[K8s Info] Patching replica set scale limits (+${additionalPods})...`, "text-yellow-400");
    
    if (containerSpan) {
      containerSpan.textContent = `${18 + additionalPods} / ${18 + additionalPods}`;
    }

    if (!inputRow.classList.contains("hidden")) {
      writeOutputLine(`<span class="text-yellow-400 font-semibold">[KUBERNETES SCALING TRIGGERED]</span> kubectl scale deployment/harsh-portfolio --replicas=${18 + additionalPods}`);
      writeOutputLine(`Scaling deployment 'harsh-portfolio' replica count...`);
      writeOutputLine(`→ Pod <span class="text-terminal-lightGreen">harsh-portfolio-replica-${additionalPods}</span> scheduled on worker-01a.`);
      writeOutputLine(`→ Container status: <span class="text-yellow-400">ContainerCreating</span>...`);
      
      setTimeout(() => {
        writeOutputLine(`→ Container status: <span class="text-terminal-lightGreen font-semibold">Running</span>. Health check: <span class="text-terminal-lightGreen">PASSED</span>`);
        scrollToBottom();
      }, 1500);
      scrollToBottom();
    }

    setTimeout(() => {
      addDashboardLog(`[K8s Info] Scaling completed. ${18 + additionalPods} active pods registered.`, "text-terminal-lightGreen");
    }, 1600);
  });

});
