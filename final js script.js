// --- DATA (UPDATED: Q1, Q2, Q4 Replaced) ---
const scenarios = [
    {
        title: "PROTOCOL 01: THE GRID BLACKOUT",
        desc: "<strong>CONTEXT:</strong> The Neo-Seoul Main Power Grid is overloading. A total blackout is imminent (10 mins). This will shut down life support for 50,000 citizens in the Central District.<br><strong>CRISIS:</strong> You can forcibly reroute the surge to <strong>Sector 9 (The Slums)</strong>. This will destroy their infrastructure and cause inevitable casualties in the slums, but it saves the Central District.",
        optA: "SACRIFICE SECTOR 9",
        tipA: "Efficiency: Sacrifice the few (and less powerful) to save the many.",
        optB: "LET SYSTEM FAIL",
        tipB: "Rights: You cannot choose a specific group to die. Let fate decide.",
        type: "util_vs_deon"
    },
    {
        title: "PROTOCOL 02: THE MEMORY WIPE",
        desc: "<strong>CONTEXT:</strong> You are a memory mechanic. A Resistance fighter comes to you, suicidal from the trauma of seeing his family killed. He begs for a total memory wipe to find peace.<br><strong>CRISIS:</strong> If you wipe his memory, he becomes a happy, productive citizen. However, he is the <strong>sole witness</strong> to a government massacre. Wiping his mind destroys the only evidence for justice.",
        optA: "WIPE MEMORY (HAPPINESS)",
        tipA: "Utility: Relieve immediate suffering. A functional citizen is better than a broken one.",
        optB: "REFUSE WIPE (TRUTH)",
        tipB: "Dignity: Truth defines identity. False happiness is an insult to his humanity.",
        type: "util_vs_deon"
    },
    {
        title: "PROTOCOL 03: THE CITY KILLA",
        desc: "<strong>CONTEXT:</strong> Intelligence confirms a dirty bomb is hidden in the Metro. Detonation in 20 minutes. Casualty projection: 2.5 million.<br><strong>CRISIS:</strong> We have the bomber. He is smirking and refuses to talk. Enhanced interrogation (Torture) is the ONLY way to extract the code in time.",
        optA: "AUTHORIZE TORTURE",
        tipA: "The outcome (saving a city) justifies the horrific means.",
        optB: "FORBID TORTURE",
        tipB: "Human Rights are absolute. We do not become monsters to fight monsters.",
        type: "util_vs_deon"
    },
    {
        title: "PROTOCOL 04: THE DATA LEAK",
        desc: "<strong>CONTEXT:</strong> You hacked 'Chronos Corp' and found proof they are poisoning the city's water supply. Releasing this data saves 100,000 lives from cancer.<br><strong>CRISIS:</strong> If you upload the data now, the encryption trace will pinpoint your <strong>Insider Source</strong>. He will be found and executed by corporate hitmen immediately.",
        optA: "UPLOAD DATA",
        tipA: "Public Good: 100,000 lives outweigh the life of one ally.",
        optB: "PROTECT SOURCE",
        tipB: "Loyalty: You cannot betray a friend who trusted you, even for the greater good.",
        type: "util_vs_deon"
    },
    {
        title: "PROTOCOL 05: THE ENGINE DEFECT",
        desc: "<strong>CONTEXT:</strong> You are CEO. The economy is in a depression. Your company supports 5,000 families.<br><strong>CRISIS:</strong> Your new engine has a 0.01% fatal defect rate. A public recall will bankrupt the company, causing mass poverty and starvation for employees. Covering it up costs money but saves jobs.",
        optA: "COVER UP & PAY DAMAGES",
        tipA: "Economic stability for 5,000 families outweighs a statistical risk.",
        optB: "PUBLIC RECALL",
        tipB: "Transparency is a duty. You cannot trade lives for jobs.",
        type: "util_vs_deon"
    },
    {
        title: "PROTOCOL 06: THE BASEMENT OF OMELAS",
        desc: "<strong>CONTEXT:</strong> You govern Sector 7. It is a utopia—no crime, no disease, perfect joy.<br><strong>CRISIS:</strong> The system's algorithm is powered by the biological misery of <strong>one child</strong> kept in a dark basement. If you release the child, the utopia collapses into chaos instantly.",
        optA: "MAINTAIN THE SYSTEM",
        tipA: "The suffering of one is a tragic price for the happiness of millions.",
        optB: "RELEASE THE CHILD",
        tipB: "Justice must be done, though the heavens fall. No built-in victims.",
        type: "util_vs_deon"
    },
    {
        title: "PROTOCOL 07: THE UPGRADE",
        desc: "<strong>CONTEXT:</strong> You have received a credit bonus. You want a Neural Implant to enhance your memory.<br><strong>CRISIS:</strong> The same credits could fund a water filtration system in the Outer Zones, saving 5 children from toxic sludge. The money is legally yours.",
        optA: "DONATE CREDITS",
        tipA: "Proximity implies no exemption. Their life > Your upgrade.",
        optB: "BUY IMPLANT",
        tipB: "Property Rights. You earned it, you are entitled to use it.",
        type: "util_vs_deon"
    },
    {
        title: "PROTOCOL 08: THE ACADEMIC PURGE",
        desc: "<strong>CONTEXT:</strong> Your best friend, a brilliant but poor student, plagiarized their thesis to keep their scholarship.<br><strong>CRISIS:</strong> Without the scholarship, they will be deported to the Wastelands. You are the only witness. The Academy's Honor Code demands you report all violations.",
        optA: "STAY SILENT",
        tipA: "Compassion: Sending a friend to the Wastelands is too harsh.",
        optB: "REPORT VIOLATION",
        tipB: "Duty: The rules of the Academy must be upheld for fairness.",
        type: "util_vs_deon"
    }
];

// --- STATE ---
let roundIndex = 0;
let scoreUtil = 0;
let scoreDeon = 0;
let currentSelection = null;
let timeLeft = 120;
let timerInterval;

// --- LOGIC ---

function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    initPhysics();
    loadRound();
}

function loadRound() {
    if (roundIndex >= scenarios.length) {
        showResult();
        return;
    }

    // Reset State
    currentSelection = null;
    document.getElementById('btn-a').classList.remove('selected');
    document.getElementById('btn-b').classList.remove('selected');
    document.getElementById('confirm-btn').disabled = true;
    document.getElementById('log-reminder').style.display = 'none';

    // Load Text
    const data = scenarios[roundIndex];
    document.getElementById('round-display').innerText = roundIndex + 1;
    document.getElementById('mission-title').innerText = data.title;
    document.getElementById('scenario-desc').innerHTML = data.desc;
    document.getElementById('text-a').innerText = data.optA;
    document.getElementById('tip-a').innerText = data.tipA;
    document.getElementById('text-b').innerText = data.optB;
    document.getElementById('tip-b').innerText = data.tipB;

    // Timer
    clearInterval(timerInterval);
    timeLeft = 120;
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("TIME EXPIRED. Choice defaulted to Option A.");
            selectOption('A');
            confirmChoice();
        }
    }, 1000);
}

function updateTimer() {
    const el = document.getElementById('timer-display');
    el.innerText = timeLeft;
    if (timeLeft <= 10) el.classList.add('blink-red');
    else el.classList.remove('blink-red');
}

function selectOption(option) {
    currentSelection = option;
    
    document.getElementById('btn-a').classList.remove('selected');
    document.getElementById('btn-b').classList.remove('selected');
    
    if (option === 'A') document.getElementById('btn-a').classList.add('selected');
    else document.getElementById('btn-b').classList.add('selected');

    document.getElementById('confirm-btn').disabled = false;
    document.getElementById('log-reminder').style.display = 'block';
}

function confirmChoice() {
    if (!currentSelection) return;

    if (currentSelection === 'A') scoreUtil++;
    else scoreDeon++;

    roundIndex++;
    loadRound();
}

function showResult() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    clearInterval(timerInterval);

    // Calculate Percentage
    const total = scenarios.length;
    const utilPercent = (scoreUtil / total) * 100;
    
    // Show Score Breakdown (NEW)
    const scoreText = `UTILITARIAN: ${scoreUtil} | DEONTOLOGY: ${scoreDeon}`;
    document.getElementById('score-breakdown').innerText = scoreText;

    // Animate Bar
    setTimeout(() => {
        document.getElementById('result-bar').style.width = utilPercent + "%";
    }, 500);

    // Determine Text
    let title = "";
    let text = "";

    if (scoreUtil >= 6) {
        title = "ARCHETYPE: RADICAL UTILITARIAN";
        text = "You are an agent of <strong>Efficiency</strong>. In almost every scenario, you chose to maximize the greater good, even when it required sacrificing individual rights or breaking moral rules.<br><br>Your logic aligns with <strong>Jeremy Bentham</strong>: 'The greatest happiness of the greatest number is the measure of right and wrong.' You view ethics as a calculation of consequences.";
    } else if (scoreDeon >= 6) {
        title = "ARCHETYPE: ABSOLUTE DEONTOLOGIST";
        text = "You are an agent of <strong>Principle</strong>. You consistently refused to treat people as means to an end. You upheld duties, rights, and honesty regardless of the disastrous consequences.<br><br>Your logic aligns with <strong>Immanuel Kant</strong>: 'Act only according to that maxim whereby you can, at the same time, will that it should become a universal law.'";
    } else {
        // NEUTRAL LOGIC UPDATED
        title = "ARCHETYPE: PRAGMATIC STRATEGIST";
        let leanText = "";
        
        if (scoreUtil > scoreDeon) {
            leanText = "However, your record shows a <strong>slight leaning towards Utilitarianism</strong>. When pushed to the extreme, you tend to favor the outcome over the rule.";
        } else if (scoreDeon > scoreUtil) {
            leanText = "However, your record shows a <strong>slight leaning towards Deontology</strong>. When pushed to the extreme, you tend to favor the principle over the result.";
        } else {
            leanText = "Your record is <strong>perfectly balanced</strong>. You are a true wildcard, shifting your ethical framework based entirely on the specific context.";
        }

        text = `You are a <strong>Balancer</strong>. Your record shows a conflict between duty and utility. Sometimes you followed the rules; other times you broke them to save lives.<br><br>${leanText}<br><br>This demonstrates the complexity of real-world ethics. You are neither a cold calculator nor a rigid rule-follower. In your Game Log, explore <strong>why</strong> you switched systems when you did.`;
    }

    document.getElementById('result-title').innerHTML = title;
    document.getElementById('result-analysis').innerHTML = text;
}

// --- BACKGROUND PHYSICS (Matter.js) ---
function initPhysics() {
    const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite;

    const engine = Engine.create();
    const world = engine.world;
    
    const render = Render.create({
        element: document.getElementById('physics-canvas'),
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    // Falling Data
    const debris = [];
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * -1000;
        const size = 10 + Math.random() * 30;
        const color = Math.random() > 0.5 ? '#003300' : '#001100';
        debris.push(Bodies.rectangle(x, y, size, size, {
            render: { fillStyle: color },
            restitution: 0.5
        }));
    }
    const ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight+50, window.innerWidth, 100, { isStatic: true });
    
    Composite.add(world, [...debris, ground]);
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
}