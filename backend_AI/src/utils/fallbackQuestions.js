const fallbackQuestions = {
    "Technical": [
        { "id": 1, "question": "What is the difference between Virtual DOM and Real DOM in React?", "type": "Technical" },
        { "id": 2, "question": "Explain closure in JavaScript and give a practical use case.", "type": "Technical" },
        { "id": 3, "question": "What are the primary differences between SQL and NoSQL databases?", "type": "Technical" },
        { "id": 4, "question": "Explain RESTful API constraints and how HTTP status codes are used.", "type": "Technical" },
        { "id": 5, "question": "How does Node.js handle asynchronous operations despite being single-threaded?", "type": "Technical" }
    ],
    "HR": [
        { "id": 1, "question": "Tell me about yourself and your professional journey.", "type": "HR" },
        { "id": 2, "question": "Why do you want to join our organization and what makes you a good fit?", "type": "HR" },
        { "id": 3, "question": "Where do you see yourself in five years and what are your career aspirations?", "type": "HR" },
        { "id": 4, "question": "How do you handle conflict or differing opinions with team members?", "type": "HR" },
        { "id": 5, "question": "What is your greatest professional strength and area of improvement?", "type": "HR" }
    ],
    "Projects": [
        { "id": 1, "question": "Walk me through the architecture of a complex project you built recently.", "type": "Projects" },
        { "id": 2, "question": "What was the most challenging technical roadblock in your project and how did you resolve it?", "type": "Projects" },
        { "id": 3, "question": "How did you manage state, data flow, and performance in your React application?", "type": "Projects" },
        { "id": 4, "question": "Explain your database schema design and why you chose that database for your project.", "type": "Projects" },
        { "id": 5, "question": "If you had to rebuild your project from scratch today, what changes would you make and why?", "type": "Projects" }
    ],
    "Behavioral": [
        { "id": 1, "question": "Describe a time you worked under a tight deadline and how you managed your time.", "type": "Behavioral" },
        { "id": 2, "question": "Explain a situation where you had to adapt quickly to a major project change.", "type": "Behavioral" },
        { "id": 3, "question": "Describe a time you failed to meet a goal and what lessons you learned from it.", "type": "Behavioral" },
        { "id": 4, "question": "Tell me about a time you took the initiative to solve a problem without being asked.", "type": "Behavioral" },
        { "id": 5, "question": "How do you handle high-pressure situations or tight delivery schedules?", "type": "Behavioral" }
    ],
    "Full-Stack Web Dev": [
        { "id": 1, "question": "How would you design and implement a secure token-based authentication system (like JWT) in a MERN stack application?", "type": "Technical" },
        { "id": 2, "question": "What is CORS, and how do you resolve CORS errors in an Express backend connecting to a React frontend?", "type": "Technical" },
        { "id": 3, "question": "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR), and when you would use each.", "type": "Technical" },
        { "id": 4, "question": "How do you optimize the performance of a React application that is rendering a large list of dynamic items?", "type": "Technical" },
        { "id": 5, "question": "Tell me about a project where you integrated third-party APIs. How did you handle errors and rate-limiting?", "type": "Projects" }
    ],
    "Frontend Engineer": [
        { "id": 1, "question": "Explain React hooks rules and how custom hooks can help in sharing stateful logic.", "type": "Technical" },
        { "id": 2, "question": "What is CSS Flexbox vs Grid, and when is it appropriate to use one over the other?", "type": "Technical" },
        { "id": 3, "question": "How would you implement state management in a large-scale application? When is Context API enough vs Redux?", "type": "Technical" },
        { "id": 4, "question": "Explain web accessibility (a11y) standards and how you ensure your UI components are accessible.", "type": "Technical" },
        { "id": 5, "question": "Describe the critical rendering path of a web page and how you optimize time-to-interactive.", "type": "Technical" }
    ],
    "Backend Engineer": [
        { "id": 1, "question": "Explain index optimization in databases. How does a database index work behind the scenes?", "type": "Technical" },
        { "id": 2, "question": "What are database transactions, and how does the ACID model guarantee data integrity?", "type": "Technical" },
        { "id": 3, "question": "Describe the event loop in Node.js. How are the microtask queue and macrotest queue executed?", "type": "Technical" },
        { "id": 4, "question": "How would you handle horizontal scaling in a REST API server? Mention load balancers and session states.", "type": "Technical" },
        { "id": 5, "question": "Explain middleware pattern in Express.js. How do error-handling middlewares differ from standard ones?", "type": "Technical" }
    ],
    "Data Scientist": [
        { "id": 1, "question": "Explain the bias-variance tradeoff in machine learning algorithms.", "type": "Technical" },
        { "id": 2, "question": "What is the difference between supervised and unsupervised learning? Give examples of both.", "type": "Technical" },
        { "id": 3, "question": "How do you handle missing values or highly imbalanced datasets before training a model?", "type": "Technical" },
        { "id": 4, "question": "What is overfitting, and what regularization techniques (like L1/L2) can prevent it?", "type": "Technical" },
        { "id": 5, "question": "Walk me through how you would evaluate the performance of a classification model.", "type": "Technical" }
    ],
    "HR & Behavior": [
        { "id": 1, "question": "Describe your ideal work culture and what role you usually adopt within a team.", "type": "HR" },
        { "id": 2, "question": "Explain a situation where you had to negotiate a deadline extension with a manager or client.", "type": "Behavioral" },
        { "id": 3, "question": "What is the most constructive feedback you've ever received, and how did you act upon it?", "type": "HR" },
        { "id": 4, "question": "Describe a time you had to deal with a team member who wasn't contributing their share.", "type": "Behavioral" },
        { "id": 5, "question": "Why should we choose you over other candidates with similar technical skillsets?", "type": "HR" }
    ]
};

const getFallbackQuestions = (category) => {
    // Return matching category or default to Technical
    return fallbackQuestions[category] || fallbackQuestions["Technical"];
};

const getFallbackGrading = (category, qaList) => {
    let totalScore = 0;
    const gradedQuestions = qaList.map((qa) => {
        const words = (qa.userAnswer || "").trim().split(/\s+/).length;
        let score = 50; // base score
        let feedback = "";
        let modelAnswer = "";

        if (words < 10) {
            score = 45;
            feedback = "Your answer is extremely brief. Try to structure your thoughts using the STAR method (Situation, Task, Action, Result) and explain your reasoning in greater technical depth.";
        } else if (words < 25) {
            score = 70;
            feedback = "Good core explanation, but it lacks specific technical terms, real-world examples, or implementation details. Try to enrich your answer with concrete context.";
        } else {
            score = 88;
            feedback = "Excellent answer with strong structure, appropriate vocabulary, and clear details. Solid explanation of the concept.";
        }

        // Generic model answer generator based on question keyword
        if (qa.question.toLowerCase().includes("dom")) {
            modelAnswer = "React's Virtual DOM is an in-memory representation of the real DOM. When state changes, a diffing algorithm calculates the minimal updates and updates the real DOM efficiently in a batch, avoiding expensive full page repaints.";
        } else if (qa.question.toLowerCase().includes("closure")) {
            modelAnswer = "A closure is the combination of a function bundled together with references to its surrounding state. Closures allow inner functions to retain access to variables declared in their outer lexical scope even after the outer function has finished executing.";
        } else if (qa.question.toLowerCase().includes("sql")) {
            modelAnswer = "SQL databases are relational, table-based, structured, and scale vertically (ideal for ACID compliance). NoSQL databases are non-relational, document/key-value based, unstructured/flexible, and scale horizontally (ideal for high-write loads).";
        } else if (qa.question.toLowerCase().includes("node.js")) {
            modelAnswer = "Node.js utilizes a single-threaded event loop that delegates heavy or blocking tasks to a background C++ pool (libuv). When async operations finish, their callbacks are pushed to the event queue to be executed in sequence.";
        } else if (qa.question.toLowerCase().includes("cors")) {
            modelAnswer = "CORS is a security mechanism enforced by browsers to prevent cross-origin resource sharing unless explicitly authorized by the server. On the server side, headers like Access-Control-Allow-Origin must be configured.";
        } else {
            modelAnswer = "A standard professional answer should start with a direct definition, follow with a brief technical elaboration of how it works, and end with a concrete real-world example from a project you worked on.";
        }

        totalScore += score;
        return {
            question: qa.question,
            userAnswer: qa.userAnswer,
            score,
            feedback,
            modelAnswer
        };
    });

    const averageScore = Math.round(totalScore / qaList.length);

    // Heuristics for communication, technical, and confidence based on average word counts
    const totalWords = qaList.reduce((acc, curr) => acc + (curr.userAnswer || "").trim().split(/\s+/).length, 0);
    const avgWords = totalWords / qaList.length;

    const communication = Math.min(100, Math.max(50, Math.round(avgWords * 2.5)));
    const technicalKnowledge = averageScore;
    const confidence = Math.min(100, Math.max(50, Math.round(averageScore * 0.9 + Math.random() * 10)));

    return {
        communication,
        technicalKnowledge,
        confidence,
        overallScore: Math.round((communication + technicalKnowledge + confidence) / 3),
        strengths: [
            "Clear articulation of core engineering concepts",
            "Structured response format showing logical flow",
            "Strong understanding of the target track fundamentals"
        ],
        weaknesses: [
            "Could include more specific examples from past projects",
            "Ensure technical terms are elaborated to show deep mastery",
            "Optimize response lengths to match standard timing constraints"
        ],
        questions: gradedQuestions
    };
};

module.exports = {
    getFallbackQuestions,
    getFallbackGrading
};
