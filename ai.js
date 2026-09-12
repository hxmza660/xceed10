// Xceed10 Smart Coach: local, API-free study explainer.
// It uses an original on-site knowledge base and chapter search.
const output = document.getElementById('aiOutput');
const status = document.getElementById('aiStatus');
const promptBox = document.getElementById('aiPrompt');
const askBtn = document.getElementById('askBtn');
const clearBtn = document.getElementById('clearBtn');

let currentMode = 'Explain';

const knowledge = [
  {
    keywords: ['real numbers','irrational','rational','prime factorisation','hcf','lcm','terminating decimal'],
    title: 'Real Numbers',
    subject: 'Maths',
    link: 'real-numbers.html',
    explain: `Real Numbers include rational and irrational numbers. A rational number can be written as p/q, where p and q are integers and q ≠ 0. An irrational number cannot be written in that form. Prime factorisation is useful for HCF, LCM and decimal-expansion questions. For p/q in lowest form, the decimal terminates only when the denominator has no prime factors other than 2 and/or 5.`,
    example: `Example: 13/40 has denominator 40 = 2³ × 5, so its decimal expansion terminates.`,
    practice: 'Find the HCF and LCM of 84 and 126 using prime factorisation.'
  },
  {
    keywords: ['polynomial','zero','zeros','remainder theorem','factor theorem','quadratic polynomial'],
    title: 'Polynomials',
    subject: 'Maths',
    link: 'polynomials.html',
    explain: `A polynomial is an algebraic expression made from variables with non-negative integer powers. A zero of a polynomial is a value of x that makes the polynomial equal to 0. For a quadratic ax² + bx + c, the sum of zeros is -b/a and the product is c/a.`,
    example: `For x² - 5x + 6, zeros are 2 and 3 because (x-2)(x-3)=0. Their sum is 5 and product is 6.`,
    practice: 'For 2x² - 7x + 3, find the sum and product of its zeros.'
  },
  {
    keywords: ['linear equations','pair of linear equations','elimination','substitution','cross multiplication','consistency'],
    title: 'Pair of Linear Equations',
    subject: 'Maths',
    link: 'pair-linear-equations.html',
    explain: `A pair of linear equations in two variables can have one solution, infinitely many solutions, or no solution. Methods include substitution, elimination and graphical reasoning. For ax+by+c=0 and dx+ey+f=0, compare a/d, b/e and c/f to discuss consistency.`,
    example: `For x+y=7 and x-y=1, adding gives 2x=8, so x=4 and y=3.`,
    practice: 'Solve 2x + 3y = 13 and x - y = 1 by elimination.'
  },
  {
    keywords: ['quadratic equation','roots','discriminant','factorisation','quadratic formula'],
    title: 'Quadratic Equations',
    subject: 'Maths',
    link: 'quadratic-equations.html',
    explain: `A quadratic equation has the form ax² + bx + c = 0 with a ≠ 0. It can be solved by factorisation, completing the square or the quadratic formula. The discriminant D=b²−4ac tells the nature of the roots: D>0 gives two distinct real roots, D=0 gives equal real roots, and D<0 gives no real roots.`,
    example: `For x²−5x+6=0, factorise as (x−2)(x−3)=0, so x=2 or 3.`,
    practice: 'Find the roots of x² - 7x + 12 = 0.'
  },
  {
    keywords: ['arithmetic progression','ap','nth term','sum of n terms','common difference'],
    title: 'Arithmetic Progressions',
    subject: 'Maths',
    link: 'arithmetic-progressions.html',
    explain: `An arithmetic progression has a constant difference d between consecutive terms. The nth term is aₙ = a + (n−1)d. The sum of the first n terms is Sₙ = n/2 [2a + (n−1)d].`,
    example: `For 3, 7, 11, 15, ... the first term a=3 and common difference d=4.`,
    practice: 'Find the 20th term of 5, 8, 11, 14, ...'
  },
  {
    keywords: ['trigonometry','sin','cos','tan','trigonometric ratio','identity','theta'],
    title: 'Introduction to Trigonometry',
    subject: 'Maths',
    link: 'introduction-to-trigonometry.html',
    explain: `In a right triangle, sinθ = perpendicular/hypotenuse, cosθ = base/hypotenuse and tanθ = perpendicular/base. The reciprocal ratios are cosec, sec and cot. A core identity is sin²θ + cos²θ = 1.`,
    example: `If sinθ = 3/5 for an acute angle, take a 3-4-5 right triangle: cosθ = 4/5 and tanθ = 3/4.`,
    practice: 'If tanθ = 5/12 for an acute angle, find sinθ and cosθ.'
  },
  {
    keywords: ['life processes','nutrition','respiration','transportation','excretion','photosynthesis'],
    title: 'Life Processes',
    subject: 'Science',
    link: 'science-life-processes.html',
    explain: `Life processes are functions needed to maintain life, such as nutrition, respiration, transport and excretion. Photosynthesis uses light energy to make glucose from carbon dioxide and water, releasing oxygen. Human digestion breaks food into simpler substances that can be absorbed and used.`,
    example: `Photosynthesis: carbon dioxide + water → glucose + oxygen, in the presence of light and chlorophyll.`,
    practice: 'Why is diffusion alone not enough to meet the oxygen needs of large multicellular organisms?'
  },
  {
    keywords: ['chemical reaction','equation','balancing','oxidation','reduction','displacement','combination'],
    title: 'Chemical Reactions and Equations',
    subject: 'Science',
    link: 'science-chemical-reactions-and-equations.html',
    explain: `A chemical reaction forms new substances. A chemical equation represents reactants and products. The equation must be balanced because atoms are conserved. Common types include combination, decomposition, displacement and double displacement reactions. Oxidation and reduction can occur together in redox reactions.`,
    example: `Magnesium reacts with oxygen to form magnesium oxide: 2Mg + O₂ → 2MgO.`,
    practice: 'Balance: Fe + H₂O → Fe₃O₄ + H₂.'
  },
  {
    keywords: ['acids bases salts','ph','neutralisation','acid','base','salt'],
    title: 'Acids, Bases and Salts',
    subject: 'Science',
    link: 'science-acids-bases-and-salts.html',
    explain: `Acids generally furnish H⁺ ions in aqueous solution, while bases provide OH⁻ ions. The pH scale indicates acidity/basicity: lower pH means more acidic and higher pH means more basic. Neutralisation is an acid-base reaction producing salt and water.`,
    example: `HCl + NaOH → NaCl + H₂O is a neutralisation reaction.`,
    practice: 'Why does distilled water show approximately neutral pH at room temperature?'
  },
  {
    keywords: ['metals nonmetals','reactivity series','ionic compounds','corrosion','extraction'],
    title: 'Metals and Non-metals',
    subject: 'Science',
    link: 'science-metals-and-non-metals.html',
    explain: `Metals are generally lustrous, malleable and good conductors; non-metals usually show opposite physical trends. The reactivity series helps predict displacement reactions and extraction methods. Corrosion is the slow deterioration of metals due to environmental reactions.`,
    example: `Zinc can displace copper from copper sulphate because zinc is more reactive than copper.`,
    practice: 'Why can a copper vessel not displace zinc from zinc sulphate solution?'
  },
  {
    keywords: ['carbon compounds','covalent','homologous series','functional group','ethanol','ethanoic acid'],
    title: 'Carbon and Its Compounds',
    subject: 'Science',
    link: 'science-carbon-and-its-compounds.html',
    explain: `Carbon forms a huge number of compounds because of tetravalency and catenation. Covalent compounds usually form by sharing electrons. A homologous series contains compounds with the same functional group and a regular difference of CH₂ between successive members.`,
    example: `Methanol and ethanol belong to the alcohol family because both contain the -OH functional group.`,
    practice: 'Why does carbon form stable chains with other carbon atoms?'
  },
  {
    keywords: ['light reflection refraction','mirror','lens','refraction','ray diagram','focal length'],
    title: 'Light: Reflection and Refraction',
    subject: 'Science',
    link: 'science-light-reflection-and-refraction.html',
    explain: `Reflection is the bouncing back of light from a surface. Refraction is the change in direction of light when it moves between transparent media because its speed changes. Mirror and lens questions rely on ray diagrams, sign conventions and the relevant formulae.`,
    example: `When light enters glass from air obliquely, it bends towards the normal because its speed decreases.`,
    practice: 'State the two laws of reflection.'
  },
  {
    keywords: ['electricity','ohm law','resistance','power','current','voltage','potential difference'],
    title: 'Electricity',
    subject: 'Science',
    link: 'science-electricity.html',
    explain: `Electric current is the rate of flow of charge. Potential difference provides the energy change per unit charge. Ohm’s law for an ohmic conductor is V = IR. Electrical power can be written as P = VI = I²R = V²/R.`,
    example: `For V=12 V and R=4 Ω, I=V/R=3 A.`,
    practice: 'A 60 W bulb works at 12 V. Find the current drawn.'
  },
  {
    keywords: ['magnetic effect','magnetic field','fleming left hand','electromagnet','motor'],
    title: 'Magnetic Effects of Electric Current',
    subject: 'Science',
    link: 'science-magnetic-effects-of-electric-current.html',
    explain: `A current-carrying conductor produces a magnetic field. The direction around a straight conductor can be found using the right-hand thumb rule. An electric motor converts electrical energy into mechanical energy using the force on a current-carrying conductor in a magnetic field.`,
    example: `Increasing the current in a coil strengthens the magnetic field of an electromagnet.`,
    practice: 'State Fleming’s left-hand rule and what each finger represents.'
  },
  {
    keywords: ['heredity','genes','dna','variation','mendel','evolution'],
    title: 'Heredity and Evolution',
    subject: 'Science',
    link: 'science-heredity-and-evolution.html',
    explain: `Heredity is the transmission of traits from parents to offspring through genetic information. Genes are segments of DNA. Variations arise through processes such as recombination and mutation, and inherited variation can contribute to evolution over generations.`,
    example: `A dominant trait can appear in the phenotype even when only one allele is present.`,
    practice: 'Differentiate between genotype and phenotype.'
  },
  {
    keywords: ['resources development','soil','resource planning','sustainable development'],
    title: 'Resources and Development',
    subject: 'SST',
    link: 'geography-resources-and-development.html',
    explain: `Resources are useful materials, abilities or features that satisfy human needs. Resource planning aims to use resources carefully and equitably. Sustainable development means meeting present needs without harming the ability of future generations to meet theirs.`,
    example: `Rainwater harvesting is an example of conservation-oriented resource use.`,
    practice: 'Why is resource planning important in India?'
  },
  {
    keywords: ['water resources','rainwater harvesting','dams','water conservation'],
    title: 'Water Resources',
    subject: 'SST',
    link: 'geography-water-resources.html',
    explain: `Water is renewable through the hydrological cycle, but usable freshwater is limited and unevenly distributed. Multipurpose projects can support irrigation, electricity and flood control, while conservation and rainwater harvesting help improve availability.`,
    example: `Rooftop rainwater harvesting collects and stores runoff for later use or groundwater recharge.`,
    practice: 'Give two reasons why water conservation is necessary.'
  },
  {
    keywords: ['power sharing','belgium','sri lanka','democracy','accommodation'],
    title: 'Power Sharing',
    subject: 'SST',
    link: 'political-science-power-sharing.html',
    explain: `Power sharing is desirable because it reduces conflict between social groups and strengthens political stability. It can take forms such as horizontal division among organs of government, vertical division among levels of government, and representation of social groups and political parties.`,
    example: `Belgium is often studied as an example of accommodation through constitutional arrangements for different linguistic communities.`,
    practice: 'Why is power sharing considered a desirable principle of democracy?'
  },
  {
    keywords: ['federalism','decentralisation','union state concurrent list','panchayat'],
    title: 'Federalism',
    subject: 'SST',
    link: 'political-science-federalism.html',
    explain: `Federalism divides constitutional powers between levels of government. In India, powers are distributed through Union, State and Concurrent Lists, while local self-government strengthens decentralisation.`,
    example: `Panchayats and Municipalities are institutions of local self-government.`,
    practice: 'State any two key features of federalism.'
  },
  {
    keywords: ['development','per capita income','literacy','infant mortality','sustainable development'],
    title: 'Development',
    subject: 'SST',
    link: 'economics-development.html',
    explain: `Development is broader than income alone. Different people can have different goals, and a good comparison may use income plus indicators such as health and education. Per capita income is average income, while public facilities and sustainability also affect well-being.`,
    example: `Two states can have similar average incomes but very different outcomes in literacy or infant mortality.`,
    practice: 'Why is average income not a complete measure of development?'
  },
  {
    keywords: ['money and credit','formal sector','informal sector','collateral','loan'],
    title: 'Money and Credit',
    subject: 'SST',
    link: 'economics-money-and-credit.html',
    explain: `Money solves the problem of double coincidence of wants and acts as a medium of exchange. Formal credit includes regulated sources such as banks and cooperatives; informal credit can carry higher interest and fewer formal protections.`,
    example: `A bank loan can help a borrower finance a productive activity while spreading repayment over time.`,
    practice: 'Why are formal sources of credit generally preferred to informal lenders?'
  },
  {
    keywords: ['letter to god','lencho'],
    title: 'A Letter to God',
    subject: 'English',
    link: 'english-a-letter-to-god.html',
    explain: `The story centres on Lencho, a farmer whose faith is tested after a hailstorm destroys his crop. Its key themes include faith, hope, irony, human kindness and the gap between expectation and reality. For exam answers, connect the character, incident and theme instead of retelling every line.`,
    example: `A strong answer can explain how Lencho's absolute faith makes the ending both hopeful and ironic.`,
    practice: 'Explain why Lencho was angry at the post office employees despite receiving help.'
  },
  {
    keywords: ['tiger in the zoo','tiger','freedom','cage','leslie norris'],
    title: 'A Tiger in the Zoo',
    subject: 'English',
    link: 'english-a-tiger-in-the-zoo.html',
    explain: `The poem contrasts a tiger's natural life in the wild with confinement in a zoo. The central ideas are loss of freedom, suppressed strength and the difference between natural and artificial environments.`,
    example: `The poem's contrast is strongest when the tiger is imagined moving freely in the forest but is shown pacing inside the cage.`,
    practice: 'How does the poem create sympathy for the tiger?'
  },
  {
    keywords: ['footprints without feet','scientist','griffin','invisibility'],
    title: 'Footprints Without Feet',
    subject: 'English',
    link: 'english-footprints-without-feet.html',
    explain: `The story follows Griffin, a scientist who discovers a way to become invisible but uses his discovery irresponsibly. The key idea is that scientific knowledge without ethics can become harmful.`,
    example: `Griffin's intelligence does not make his actions right; the story separates scientific ability from moral responsibility.`,
    practice: 'Why is Griffin presented as a brilliant but irresponsible scientist?'
  }
];

function normalise(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreEntry(query, entry) {
  const q = normalise(query);
  let score = 0;
  for (const keyword of entry.keywords) {
    const k = normalise(keyword);
    if (q.includes(k)) score += k.length >= 8 ? 5 : 2;
    else {
      const parts = k.split(' ').filter(Boolean);
      score += parts.filter(p => q.includes(p)).length;
    }
  }
  return score;
}

function bestEntry(query) {
  return knowledge
    .map(entry => ({entry, score: scoreEntry(query, entry)}))
    .sort((a, b) => b.score - a.score)[0];
}

function renderAnswer(entry, query) {
  const prefix = currentMode === 'Quiz'
    ? `🎯 <strong>Quick check:</strong><br>${entry.practice}`
    : currentMode === 'Study Plan'
      ? `🗓️ <strong>Study plan for this topic:</strong><br>1) Learn the Ace Notes for 15 min<br>2) Re-read the example for 5 min<br>3) Solve the practice question for 10 min<br>4) Write one mistake/recall point before moving on.`
      : currentMode === 'Doubt'
        ? `❓ <strong>Core idea:</strong><br>${entry.explain}`
        : `<strong>Simple explanation:</strong><br>${entry.explain}`;

  output.innerHTML = `
    <div class="coach-result">
      <div class="coach-topic"><span class="tag">${entry.subject}</span> <strong>${entry.title}</strong></div>
      <div class="coach-block">${prefix}</div>
      <div class="coach-block"><strong>🧩 Example:</strong><br>${entry.example}</div>
      <div class="coach-block"><strong>📝 Practice:</strong><br>${entry.practice}</div>
      <a class="cta" href="${entry.link}">Open ${entry.title} →</a>
      <p class="muted coach-note">Xceed10 Smart Coach is using its original chapter knowledge base here. It cannot invent answers for every unseen question like a generative AI model.</p>
    </div>`;
}

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
  });
});

clearBtn.addEventListener('click', () => {
  promptBox.value = '';
  output.textContent = 'Your Xceed10 Smart Coach answer will appear here.';
  status.textContent = '';
});

askBtn.addEventListener('click', () => {
  const query = promptBox.value.trim();
  if (!query) {
    status.textContent = 'Write a question or topic first.';
    status.className = 'ai-status danger';
    return;
  }
  const result = bestEntry(query);
  if (!result || result.score < 2) {
    status.textContent = 'I could not find a close topic in the current Xceed10 knowledge base.';
    status.className = 'ai-status danger';
    output.innerHTML = `<strong>Try asking about:</strong><br>Quadratic Equations, Trigonometry, Electricity, Life Processes, Federalism, Development, Money and Credit, A Letter to God, A Tiger in the Zoo, or another chapter currently available on Xceed10.<br><br><span class="muted">You can also open a chapter directly and use its Ace Notes and practice section.</span>`;
    return;
  }
  status.textContent = `Found: ${result.entry.title}`;
  status.className = 'ai-status success';
  renderAnswer(result.entry, query);
});
