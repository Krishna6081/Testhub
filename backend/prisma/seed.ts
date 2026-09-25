import { PrismaClient, Role, QuestionType, Difficulty, TestType, TestStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TestHub database seed...');

  // 1. Clean existing data
  await prisma.attemptAnswer.deleteMany({});
  await prisma.testAttempt.deleteMany({});
  await prisma.testQuestion.deleteMany({});
  await prisma.test.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.subTopic.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing database records.');

  // 2. Create Users
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@testhub.com',
      password: hashedPasswordAdmin,
      role: Role.ADMIN,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'user@testhub.com',
      password: hashedPasswordUser,
      role: Role.USER,
    },
  });

  const demoUser2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@testhub.com',
      password: hashedPasswordUser,
      role: Role.USER,
    },
  });

  const demoUser3 = await prisma.user.create({
    data: {
      name: 'Rahul Verma',
      email: 'rahul@testhub.com',
      password: hashedPasswordUser,
      role: Role.USER,
    },
  });

  console.log('👥 Created Users: Admin & Demo Users');

  // 3. Create Exam Types
  const sscExam = await prisma.exam.create({
    data: { name: 'SSC CGL / CHSL', description: 'Staff Selection Commission Examination' }
  });
  const bankingExam = await prisma.exam.create({
    data: { name: 'Banking PO / Clerk', description: 'IBPS & SBI Probationary Officer and Clerk Exams' }
  });
  const railwayExam = await prisma.exam.create({
    data: { name: 'RRB NTPC', description: 'Railway Recruitment Board NTPC Exam' }
  });

  // 4. Create Sections
  const reasoningSec = await prisma.section.create({
    data: {
      name: 'Reasoning',
      description: 'Logical reasoning, analytical thinking, non-verbal aptitude, and puzzle solving.',
      icon: 'Brain',
    },
  });

  const mathSec = await prisma.section.create({
    data: {
      name: 'Mathematics',
      description: 'Quantitative aptitude, arithmetic operations, algebra, geometry, and data interpretation.',
      icon: 'Calculator',
    },
  });

  const scienceSec = await prisma.section.create({
    data: {
      name: 'Science',
      description: 'General science fundamentals covering Physics, Chemistry, and Biology.',
      icon: 'Atom',
    },
  });

  const gkSec = await prisma.section.create({
    data: {
      name: 'General Knowledge (GK)',
      description: 'Indian history, polity, geography, economics, and static awareness.',
      icon: 'Globe',
    },
  });

  console.log('📚 Created 4 Primary Sections');

  // 5. Create Topics for each Section

  // Reasoning Topics
  const reasoningTopicNames = [
    'Analogy', 'Classification', 'Series', 'Coding-Decoding', 'Blood Relations',
    'Direction Sense', 'Ranking', 'Syllogism', 'Statement and Conclusion',
    'Seating Arrangement', 'Puzzle', 'Venn Diagram', 'Clock', 'Calendar', 'Alphabet Test'
  ];
  const reasoningTopicsMap: Record<string, any> = {};
  for (const name of reasoningTopicNames) {
    reasoningTopicsMap[name] = await prisma.topic.create({
      data: {
        sectionId: reasoningSec.id,
        name,
        description: `Practice questions and tests on ${name} in Reasoning.`,
      },
    });
  }

  // Mathematics Topics
  const mathTopicNames = [
    'Number System', 'Simplification', 'Percentage', 'Profit and Loss',
    'Ratio and Proportion', 'Average', 'Time and Work', 'Pipes and Cisterns',
    'Time Speed Distance', 'Simple Interest', 'Compound Interest', 'Partnership',
    'Mixture and Allegation', 'Algebra', 'Geometry', 'Mensuration',
    'Probability', 'Permutation and Combination', 'Data Interpretation'
  ];
  const mathTopicsMap: Record<string, any> = {};
  for (const name of mathTopicNames) {
    mathTopicsMap[name] = await prisma.topic.create({
      data: {
        sectionId: mathSec.id,
        name,
        description: `Master concepts and solve practice problems on ${name}.`,
      },
    });
  }

  // Science Topics
  const scienceTopicNames = ['Physics', 'Chemistry', 'Biology'];
  const scienceTopicsMap: Record<string, any> = {};
  for (const name of scienceTopicNames) {
    scienceTopicsMap[name] = await prisma.topic.create({
      data: {
        sectionId: scienceSec.id,
        name,
        description: `Fundamental principles and objective questions on ${name}.`,
      },
    });
  }

  // Science Subtopics
  const physicsSubtopics = ['Motion', 'Force', 'Work and Energy', 'Power', 'Electricity', 'Magnetism', 'Light', 'Sound', 'Heat', 'Measurement'];
  for (const sub of physicsSubtopics) {
    await prisma.subTopic.create({
      data: { topicId: scienceTopicsMap['Physics'].id, name: sub, description: `Study notes and MCQs on ${sub}` }
    });
  }
  const chemistrySubtopics = ['Matter', 'Atoms and Molecules', 'Elements', 'Compounds', 'Acids and Bases', 'Metals and Non-metals', 'Chemical Reactions', 'Periodic Table', 'Carbon', 'Everyday Chemistry'];
  for (const sub of chemistrySubtopics) {
    await prisma.subTopic.create({
      data: { topicId: scienceTopicsMap['Chemistry'].id, name: sub, description: `Concepts on ${sub}` }
    });
  }
  const biologySubtopics = ['Human Body', 'Nutrition', 'Diseases', 'Cell', 'Plants', 'Animals', 'Genetics', 'Reproduction', 'Ecology', 'Human Systems'];
  for (const sub of biologySubtopics) {
    await prisma.subTopic.create({
      data: { topicId: scienceTopicsMap['Biology'].id, name: sub, description: `Questions on ${sub}` }
    });
  }

  // GK Topics
  const gkTopicNames = [
    'Indian History', 'Geography', 'Indian Polity', 'Economics', 'Static GK',
    'Indian Constitution', 'Important Days', 'Books and Authors', 'Awards',
    'Sports', 'Countries and Capitals', 'National Parks', 'Rivers', 'Mountains', 'Government Schemes'
  ];
  const gkTopicsMap: Record<string, any> = {};
  for (const name of gkTopicNames) {
    gkTopicsMap[name] = await prisma.topic.create({
      data: {
        sectionId: gkSec.id,
        name,
        description: `Important facts and exam questions on ${name}.`,
      },
    });
  }

  console.log('🏷️ Created Topics and Subtopics for all Sections');

  // 6. Create realistic Questions & Options for each section

  const questionsData = [
    // --- REASONING QUESTIONS ---
    {
      sectionId: reasoningSec.id,
      topicId: reasoningTopicsMap['Coding-Decoding'].id,
      questionText: 'If in a certain code language, "COMPUTER" is written as "RFUVQNPC", how is "MEDICINE" written in that code language?',
      difficulty: Difficulty.MEDIUM,
      explanation: 'Reverse the order of letters and then shift each letter: R-E-C-I-N-I-D-E-M -> Shift outer letters unchanged and middle letters +1. Result is EOJDJEFM.',
      options: [
        { optionText: 'EOJDJEFM', isCorrect: true, optionOrder: 1 },
        { optionText: 'EOJDEJFM', isCorrect: false, optionOrder: 2 },
        { optionText: 'MFEJDJOE', isCorrect: false, optionOrder: 3 },
        { optionText: 'MFEDJJEO', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: reasoningSec.id,
      topicId: reasoningTopicsMap['Analogy'].id,
      questionText: 'Select the related word pair: Newspaper : Press :: Cloth : ?',
      difficulty: Difficulty.EASY,
      explanation: 'A newspaper is printed in a press. Similarly, cloth is manufactured in a mill.',
      options: [
        { optionText: 'Tailor', isCorrect: false, optionOrder: 1 },
        { optionText: 'Textile', isCorrect: false, optionOrder: 2 },
        { optionText: 'Mill', isCorrect: true, optionOrder: 3 },
        { optionText: 'Fibre', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: reasoningSec.id,
      topicId: reasoningTopicsMap['Series'].id,
      questionText: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
      difficulty: Difficulty.EASY,
      explanation: 'Pattern is (x * 2) + 1. Next term = 63 * 2 + 1 = 127.',
      options: [
        { optionText: '125', isCorrect: false, optionOrder: 1 },
        { optionText: '127', isCorrect: true, optionOrder: 2 },
        { optionText: '128', isCorrect: false, optionOrder: 3 },
        { optionText: '131', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: reasoningSec.id,
      topicId: reasoningTopicsMap['Blood Relations'].id,
      questionText: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
      difficulty: Difficulty.MEDIUM,
      explanation: 'Since the man has no brother or sister, "my father\'s son" means himself. So that man\'s father is himself. Thus, it was his son\'s photograph.',
      options: [
        { optionText: 'His nephew', isCorrect: false, optionOrder: 1 },
        { optionText: 'His father', isCorrect: false, optionOrder: 2 },
        { optionText: 'His own', isCorrect: false, optionOrder: 3 },
        { optionText: 'His son', isCorrect: true, optionOrder: 4 },
      ],
    },
    {
      sectionId: reasoningSec.id,
      topicId: reasoningTopicsMap['Syllogism'].id,
      questionText: 'Statements: All dogs are cats. All cats are animals.\nConclusions: I. All dogs are animals. II. Some animals are cats.',
      difficulty: Difficulty.MEDIUM,
      explanation: 'From All dogs -> cats -> animals, it directly follows that all dogs are animals, and some animals are cats. Both I and II follow.',
      options: [
        { optionText: 'Only conclusion I follows', isCorrect: false, optionOrder: 1 },
        { optionText: 'Only conclusion II follows', isCorrect: false, optionOrder: 2 },
        { optionText: 'Both I and II follow', isCorrect: true, optionOrder: 3 },
        { optionText: 'Neither I nor II follows', isCorrect: false, optionOrder: 4 },
      ],
    },

    // --- MATHEMATICS QUESTIONS ---
    {
      sectionId: mathSec.id,
      topicId: mathTopicsMap['Percentage'].id,
      questionText: 'If the price of sugar is increased by 20%, by what percentage should a household reduce its consumption so that the expenditure remains unchanged?',
      difficulty: Difficulty.MEDIUM,
      explanation: 'Reduction % = [r / (100 + r)] * 100 = [20 / 120] * 100 = 16.67%.',
      options: [
        { optionText: '16.67%', isCorrect: true, optionOrder: 1 },
        { optionText: '20%', isCorrect: false, optionOrder: 2 },
        { optionText: '15%', isCorrect: false, optionOrder: 3 },
        { optionText: '25%', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: mathSec.id,
      topicId: mathTopicsMap['Profit and Loss'].id,
      questionText: 'An article is sold for $840 at a profit of 20%. What was the cost price of the article?',
      difficulty: Difficulty.EASY,
      explanation: 'Cost Price = Selling Price / (1 + Profit %) = 840 / 1.2 = $700.',
      options: [
        { optionText: '$680', isCorrect: false, optionOrder: 1 },
        { optionText: '$700', isCorrect: true, optionOrder: 2 },
        { optionText: '$720', isCorrect: false, optionOrder: 3 },
        { optionText: '$750', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: mathSec.id,
      topicId: mathTopicsMap['Time and Work'].id,
      questionText: 'A can complete a piece of work in 12 days and B can complete it in 18 days. How many days will they take to complete the work together?',
      difficulty: Difficulty.MEDIUM,
      explanation: 'Combined 1 day work = (1/12) + (1/18) = 5/36. Total days = 36/5 = 7.2 days.',
      options: [
        { optionText: '6 days', isCorrect: false, optionOrder: 1 },
        { optionText: '7.2 days', isCorrect: true, optionOrder: 2 },
        { optionText: '8 days', isCorrect: false, optionOrder: 3 },
        { optionText: '9 days', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: mathSec.id,
      topicId: mathTopicsMap['Ratio and Proportion'].id,
      questionText: 'If A:B = 2:3 and B:C = 4:5, find the ratio A:B:C.',
      difficulty: Difficulty.EASY,
      explanation: 'Multiply first ratio by 4 and second ratio by 3: A:B = 8:12, B:C = 12:15. Hence A:B:C = 8:12:15.',
      options: [
        { optionText: '8 : 12 : 15', isCorrect: true, optionOrder: 1 },
        { optionText: '2 : 4 : 5', isCorrect: false, optionOrder: 2 },
        { optionText: '6 : 8 : 10', isCorrect: false, optionOrder: 3 },
        { optionText: '8 : 10 : 15', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: mathSec.id,
      topicId: mathTopicsMap['Number System'].id,
      questionText: 'What is the unit digit of (7)^95 - (3)^58 ?',
      difficulty: Difficulty.HARD,
      explanation: 'Cyclicity of 7 is 4: 95 mod 4 = 3 -> 7^3 ends in 3. Cyclicity of 3 is 4: 58 mod 4 = 2 -> 3^2 ends in 9. Unit digit = (13 - 9) = 4.',
      options: [
        { optionText: '0', isCorrect: false, optionOrder: 1 },
        { optionText: '4', isCorrect: true, optionOrder: 2 },
        { optionText: '6', isCorrect: false, optionOrder: 3 },
        { optionText: '7', isCorrect: false, optionOrder: 4 },
      ],
    },

    // --- SCIENCE QUESTIONS ---
    {
      sectionId: scienceSec.id,
      topicId: scienceTopicsMap['Physics'].id,
      questionText: 'What is the SI unit of Work and Energy?',
      difficulty: Difficulty.EASY,
      explanation: 'The SI unit of both Work and Energy is the Joule (J). Watt is power, Newton is force, Pascal is pressure.',
      options: [
        { optionText: 'Watt', isCorrect: false, optionOrder: 1 },
        { optionText: 'Newton', isCorrect: false, optionOrder: 2 },
        { optionText: 'Joule', isCorrect: true, optionOrder: 3 },
        { optionText: 'Pascal', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: scienceSec.id,
      topicId: scienceTopicsMap['Chemistry'].id,
      questionText: 'Which gas is commonly known as "Laughing Gas"?',
      difficulty: Difficulty.EASY,
      explanation: 'Nitrous oxide (N2O) is commonly referred to as laughing gas due to its intoxicating effects when inhaled.',
      options: [
        { optionText: 'Nitric Oxide', isCorrect: false, optionOrder: 1 },
        { optionText: 'Nitrous Oxide', isCorrect: true, optionOrder: 2 },
        { optionText: 'Nitrogen Dioxide', isCorrect: false, optionOrder: 3 },
        { optionText: 'Carbon Monoxide', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: scienceSec.id,
      topicId: scienceTopicsMap['Biology'].id,
      questionText: 'Which cellular organelle is known as the "Powerhouse of the Cell"?',
      difficulty: Difficulty.EASY,
      explanation: 'Mitochondria generate most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.',
      options: [
        { optionText: 'Ribosome', isCorrect: false, optionOrder: 1 },
        { optionText: 'Nucleus', isCorrect: false, optionOrder: 2 },
        { optionText: 'Golgi Apparatus', isCorrect: false, optionOrder: 3 },
        { optionText: 'Mitochondria', isCorrect: true, optionOrder: 4 },
      ],
    },
    {
      sectionId: scienceSec.id,
      topicId: scienceTopicsMap['Physics'].id,
      questionText: 'Which phenomenon explains the bending of light when it passes from one transparent medium into another?',
      difficulty: Difficulty.MEDIUM,
      explanation: 'Refraction is the change in direction of a wave passing from one medium to another caused by its change in speed.',
      options: [
        { optionText: 'Reflection', isCorrect: false, optionOrder: 1 },
        { optionText: 'Refraction', isCorrect: true, optionOrder: 2 },
        { optionText: 'Diffraction', isCorrect: false, optionOrder: 3 },
        { optionText: 'Dispersion', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: scienceSec.id,
      topicId: scienceTopicsMap['Chemistry'].id,
      questionText: 'What is the pH value of pure distilled water at 25°C?',
      difficulty: Difficulty.EASY,
      explanation: 'Pure water has a neutral pH of 7 at 25°C.',
      options: [
        { optionText: '0', isCorrect: false, optionOrder: 1 },
        { optionText: '7', isCorrect: true, optionOrder: 2 },
        { optionText: '14', isCorrect: false, optionOrder: 3 },
        { optionText: '5.5', isCorrect: false, optionOrder: 4 },
      ],
    },

    // --- GENERAL KNOWLEDGE QUESTIONS ---
    {
      sectionId: gkSec.id,
      topicId: gkTopicsMap['Indian Polity'].id,
      questionText: 'Who is known as the "Father of the Indian Constitution"?',
      difficulty: Difficulty.EASY,
      explanation: 'Dr. B.R. Ambedkar was the Chairman of the Drafting Committee of the Constituent Assembly.',
      options: [
        { optionText: 'Mahatma Gandhi', isCorrect: false, optionOrder: 1 },
        { optionText: 'Jawaharlal Nehru', isCorrect: false, optionOrder: 2 },
        { optionText: 'Dr. B.R. Ambedkar', isCorrect: true, optionOrder: 3 },
        { optionText: 'Sardar Vallabhbhai Patel', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: gkSec.id,
      topicId: gkTopicsMap['Geography'].id,
      questionText: 'Which is the longest river in India?',
      difficulty: Difficulty.EASY,
      explanation: 'The Ganga (Ganges) is the longest river flowing entirely within India, spanning approximately 2,525 km.',
      options: [
        { optionText: 'Godavari', isCorrect: false, optionOrder: 1 },
        { optionText: 'Ganga', isCorrect: true, optionOrder: 2 },
        { optionText: 'Yamuna', isCorrect: false, optionOrder: 3 },
        { optionText: 'Brahmaputra', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: gkSec.id,
      topicId: gkTopicsMap['Indian History'].id,
      questionText: 'In which year did the Battle of Plassey take place?',
      difficulty: Difficulty.MEDIUM,
      explanation: 'The Battle of Plassey took place on 23 June 1757 between the East India Company led by Robert Clive and Nawab of Bengal.',
      options: [
        { optionText: '1757', isCorrect: true, optionOrder: 1 },
        { optionText: '1764', isCorrect: false, optionOrder: 2 },
        { optionText: '1857', isCorrect: false, optionOrder: 3 },
        { optionText: '1748', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: gkSec.id,
      topicId: gkTopicsMap['National Parks'].id,
      questionText: 'Kaziranga National Park is famous for which animal?',
      difficulty: Difficulty.EASY,
      explanation: 'Kaziranga National Park in Assam is world famous for its population of the Great One-horned Rhinoceros.',
      options: [
        { optionText: 'Royal Bengal Tiger', isCorrect: false, optionOrder: 1 },
        { optionText: 'One-horned Rhinoceros', isCorrect: true, optionOrder: 2 },
        { optionText: 'Asiatic Lion', isCorrect: false, optionOrder: 3 },
        { optionText: 'Snow Leopard', isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      sectionId: gkSec.id,
      topicId: gkTopicsMap['Economics'].id,
      questionText: 'Which institution in India acts as the regulator of the monetary policy and central banking system?',
      difficulty: Difficulty.EASY,
      explanation: 'The Reserve Bank of India (RBI) is the central bank and monetary regulator of India.',
      options: [
        { optionText: 'SEBI', isCorrect: false, optionOrder: 1 },
        { optionText: 'NITI Aayog', isCorrect: false, optionOrder: 2 },
        { optionText: 'State Bank of India', isCorrect: false, optionOrder: 3 },
        { optionText: 'Reserve Bank of India', isCorrect: true, optionOrder: 4 },
      ],
    },
  ];

  const createdQuestions = [];

  for (const q of questionsData) {
    const createdQ = await prisma.question.create({
      data: {
        sectionId: q.sectionId,
        topicId: q.topicId,
        questionText: q.questionText,
        questionType: QuestionType.SINGLE_CHOICE,
        difficulty: q.difficulty,
        explanation: q.explanation,
        marks: 1.0,
        negativeMarks: 0.25,
        options: {
          create: q.options,
        },
      },
      include: {
        options: true,
      },
    });
    createdQuestions.push(createdQ);
  }

  console.log(`❓ Created ${createdQuestions.length} realistic Questions with options and explanations.`);

  // Filter created questions by section
  const reasoningQs = createdQuestions.filter(q => q.sectionId === reasoningSec.id);
  const mathQs = createdQuestions.filter(q => q.sectionId === mathSec.id);
  const scienceQs = createdQuestions.filter(q => q.sectionId === scienceSec.id);
  const gkQs = createdQuestions.filter(q => q.sectionId === gkSec.id);

  // 7. Create Demo Tests

  // 1) Reasoning Practice Test
  const reasoningTest = await prisma.test.create({
    data: {
      title: 'Reasoning Mastery & Speed Test',
      description: 'Test your logical thinking, coding-decoding, and series problem solving skills.',
      examId: sscExam.id,
      sectionId: reasoningSec.id,
      topicId: reasoningTopicsMap['Coding-Decoding'].id,
      duration: 15,
      totalQuestions: reasoningQs.length,
      totalMarks: reasoningQs.length * 1.0,
      negativeMarking: 0.25,
      difficulty: Difficulty.MEDIUM,
      testType: TestType.TOPIC,
      status: TestStatus.PUBLISHED,
      testQuestions: {
        create: reasoningQs.map((q, idx) => ({
          questionId: q.id,
          questionOrder: idx + 1,
        })),
      },
    },
  });

  // 2) Mathematics Practice Test
  const mathTest = await prisma.test.create({
    data: {
      title: 'Mathematics Quantitative Aptitude Drill',
      description: 'Practice speed calculation, percentages, ratio, profit and loss for competitive exams.',
      examId: sscExam.id,
      sectionId: mathSec.id,
      topicId: mathTopicsMap['Percentage'].id,
      duration: 20,
      totalQuestions: mathQs.length,
      totalMarks: mathQs.length * 1.0,
      negativeMarking: 0.25,
      difficulty: Difficulty.MEDIUM,
      testType: TestType.SECTION,
      status: TestStatus.PUBLISHED,
      testQuestions: {
        create: mathQs.map((q, idx) => ({
          questionId: q.id,
          questionOrder: idx + 1,
        })),
      },
    },
  });

  // 3) Science Practice Test
  const scienceTest = await prisma.test.create({
    data: {
      title: 'General Science Fundamental Test',
      description: 'Basic to intermediate questions from Physics, Chemistry, and Biology.',
      examId: railwayExam.id,
      sectionId: scienceSec.id,
      topicId: scienceTopicsMap['Physics'].id,
      duration: 15,
      totalQuestions: scienceQs.length,
      totalMarks: scienceQs.length * 1.0,
      negativeMarking: 0.25,
      difficulty: Difficulty.EASY,
      testType: TestType.PRACTICE,
      status: TestStatus.PUBLISHED,
      testQuestions: {
        create: scienceQs.map((q, idx) => ({
          questionId: q.id,
          questionOrder: idx + 1,
        })),
      },
    },
  });

  // 4) GK Practice Test
  const gkTest = await prisma.test.create({
    data: {
      title: 'General Knowledge & Current Awareness',
      description: 'Important questions covering Polity, History, Geography, and Economics.',
      examId: sscExam.id,
      sectionId: gkSec.id,
      topicId: gkTopicsMap['Indian Polity'].id,
      duration: 15,
      totalQuestions: gkQs.length,
      totalMarks: gkQs.length * 1.0,
      negativeMarking: 0.25,
      difficulty: Difficulty.EASY,
      testType: TestType.TOPIC,
      status: TestStatus.PUBLISHED,
      testQuestions: {
        create: gkQs.map((q, idx) => ({
          questionId: q.id,
          questionOrder: idx + 1,
        })),
      },
    },
  });

  // 5) Mixed Test
  const mixedTest = await prisma.test.create({
    data: {
      title: 'All-Rounder Mixed Challenge',
      description: 'A balanced combination of questions from Reasoning, Math, Science, and GK.',
      examId: bankingExam.id,
      duration: 25,
      totalQuestions: 10,
      totalMarks: 10.0,
      negativeMarking: 0.25,
      difficulty: Difficulty.MEDIUM,
      testType: TestType.MIXED,
      status: TestStatus.PUBLISHED,
      testQuestions: {
        create: [
          ...reasoningQs.slice(0, 3),
          ...mathQs.slice(0, 3),
          ...scienceQs.slice(0, 2),
          ...gkQs.slice(0, 2)
        ].map((q, idx) => ({
          questionId: q.id,
          questionOrder: idx + 1,
        })),
      },
    },
  });

  // 6) Daily Test #125
  const dailyTest = await prisma.test.create({
    data: {
      title: 'Daily Practice Challenge #125',
      description: 'Daily quick test with mixed topics to keep your exam preparation on track.',
      examId: sscExam.id,
      duration: 15,
      totalQuestions: 8,
      totalMarks: 8.0,
      negativeMarking: 0.25,
      difficulty: Difficulty.MEDIUM,
      testType: TestType.DAILY,
      status: TestStatus.PUBLISHED,
      testQuestions: {
        create: [
          ...reasoningQs.slice(0, 2),
          ...mathQs.slice(0, 2),
          ...scienceQs.slice(0, 2),
          ...gkQs.slice(0, 2)
        ].map((q, idx) => ({
          questionId: q.id,
          questionOrder: idx + 1,
        })),
      },
    },
  });

  // 7) Full Length Test
  const fullLengthTest = await prisma.test.create({
    data: {
      title: 'SSC CGL Tier 1 Full-Length Mock Test',
      description: 'Complete mock exam structured exactly like official competitive exams.',
      examId: sscExam.id,
      duration: 60,
      totalQuestions: createdQuestions.length,
      totalMarks: createdQuestions.length * 1.0,
      negativeMarking: 0.25,
      difficulty: Difficulty.HARD,
      testType: TestType.FULL_LENGTH,
      status: TestStatus.PUBLISHED,
      testQuestions: {
        create: createdQuestions.map((q, idx) => ({
          questionId: q.id,
          questionOrder: idx + 1,
        })),
      },
    },
  });

  console.log('📝 Created 7 Demo Tests (Topic, Section, Mixed, Practice, Daily #125, Full-Length)');

  // 8. Create Sample Attempt Records for Demo User so Dashboard and Analytics look great
  const attempt1 = await prisma.testAttempt.create({
    data: {
      userId: demoUser.id,
      testId: reasoningTest.id,
      startTime: new Date(Date.now() - 86400000 * 2),
      endTime: new Date(Date.now() - 86400000 * 2 + 600000),
      timeTaken: 600,
      score: 4.0,
      percentage: 80.0,
      correctAnswers: 4,
      incorrectAnswers: 1,
      unattempted: 0,
      accuracy: 80.0,
      status: 'COMPLETED',
      answers: {
        create: reasoningQs.map(q => {
          const correctOpt = q.options.find(o => o.isCorrect);
          return {
            questionId: q.id,
            selectedOptionId: correctOpt?.id,
            isCorrect: true,
            marksObtained: 1.0,
            timeSpent: 120,
          };
        }),
      },
    },
  });

  const attempt2 = await prisma.testAttempt.create({
    data: {
      userId: demoUser.id,
      testId: mathTest.id,
      startTime: new Date(Date.now() - 86400000),
      endTime: new Date(Date.now() - 86400000 + 900000),
      timeTaken: 900,
      score: 2.75,
      percentage: 55.0,
      correctAnswers: 3,
      incorrectAnswers: 1,
      unattempted: 1,
      accuracy: 75.0,
      status: 'COMPLETED',
      answers: {
        create: mathQs.slice(0, 4).map((q, i) => {
          const correctOpt = q.options.find(o => o.isCorrect);
          const wrongOpt = q.options.find(o => !o.isCorrect);
          const isCorr = i !== 1;
          return {
            questionId: q.id,
            selectedOptionId: isCorr ? correctOpt?.id : wrongOpt?.id,
            isCorrect: isCorr,
            marksObtained: isCorr ? 1.0 : -0.25,
            timeSpent: 180,
          };
        }),
      },
    },
  });

  // Bookmark a question for demo user
  await prisma.bookmark.create({
    data: {
      userId: demoUser.id,
      questionId: mathQs[4].id, // Number System hard question
    },
  });

  console.log('📊 Seeded Sample Attempts & Bookmarks for Alex Johnson');
  console.log('✅ TestHub Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
