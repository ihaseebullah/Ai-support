const express = require('express')
const bodyParser = require('body-parser');
const { chatbot } = require('./chatbot')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
const wellness = `Wellness Hub App Overview
The Wellness Hub app is designed to empower users in managing their hydration and workout routines effectively. It offers a user-friendly interface that simplifies tracking and planning, making wellness an integral part of daily life.
Hydration Tracking
On the front screen, users will find a prominent "Hydrate Now" section. By clicking on this container, users can easily log their water intake. This feature allows them to:
Record Hydration: Quickly input the amount of water consumed, ensuring they stay on track with their hydration goals.
Access Historical Data: Users can view their hydration records at any time, helping them monitor their daily and weekly water consumption patterns.
This functionality encourages users to maintain optimal hydration levels, which is essential for overall health and well-being.
Workout Management
The app also includes a dedicated section for workout management, where users can create and organize their fitness routines. Key features include:
Create Workouts: Users can design personalized workouts tailored to their fitness levels and goals.
Worklist Creation: Users can compile specific workouts into a worklist, allowing them to group exercises that complement each other.
Schedule Workouts: By selecting specific days for their worklists, users ensure that their workouts are automatically marked as available on those days, promoting consistency in their fitness journey.
This structured approach helps users stay organized and committed to their workout plans, making it easier to achieve their fitness objectives.
User-Friendly Experience
The Wellness Hub app is designed with user experience in mind. Its intuitive layout allows for easy navigation between hydration tracking and workout management, ensuring that users can quickly access the features they need.
Data Storage and Accessibility
All user data, including hydration logs and workout plans, is securely stored in a database. This ensures that users can access their information anytime, from any device. The ability to track progress over time helps users identify trends in their hydration and fitness habits, fostering a sense of accomplishment and motivation. In summary, the Wellness Hub app combines hydration tracking and workout management into a single platform, making it easier for users to maintain a healthy lifestyle. With its user-friendly design and robust features, the app supports users in achieving their wellness goals efficiently and effectively`
app.post('/api/chatbot/', async (req, res) => {
    const { prompt, history } = req.body;
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [
                        {
                            text: "You are going to act as an assistant in my app.And your name for the time being is Eleven Assistant if someone ask you.Here are furtur details the user may ask " + wellness
                        }
                    ]
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: "Response message here"
                        }
                    ]
                }
            ],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });
        const result = await chat.sendMessage(prompt);
        res.status(200).json({ output: result.response.text() })
    } catch (e) {
        res.status(500).json({ output: "Internal Server Error", message: e.message })
    }
})
app.listen(3000, () => console.log('listening on port 3000'))