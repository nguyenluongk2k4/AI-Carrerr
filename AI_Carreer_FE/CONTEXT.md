\# Project Context

Project: Hành Trang Số  

Type: AI-powered career guidance platform  

Target users: Vietnamese high school students (grade 10–12) and parents



\---



\# 1. Project Goal



Hành Trang Số is a web platform that helps students choose a suitable:



\- career / major

\- university

\- study roadmap



based on:



\- personality tests

\- interests

\- academic ability

\- exam scores

\- financial constraints

\- geographic preference



The system uses AI analysis and rule-based scoring to recommend:



\- suitable majors

\- universities

\- admission probability

\- financial estimation

\- roadmap to achieve target university.



\---



\# 2. Core Concept



The platform is built around \*\*Gap Analysis + Career Roadmap\*\*.



Instead of only recommending careers, the system also answers:



\- Which major fits the student?

\- Which universities are realistic?

\- What score is required?

\- What skills or subjects need improvement?

\- What roadmap should the student follow?



\---



\# 3. Main Features



\## 1. Career Assessment



Students complete several tests:



\- personality test

\- interest test

\- ability test



Purpose: build a student profile.



\---



\## 2. Academic Data Input



Students provide:



\- GPA or exam score

\- subject combination (A00, A01, D01...)

\- preferred region

\- financial capability

\- career interests



This data becomes the \*\*AI input vector\*\*.



\---



\## 3. AI Career Matching



The system calculates compatibility between the student and different majors.



Output:



\- top matching majors

\- compatibility percentage

\- explanation of why the major fits the student



Example:



Software Engineering – 87% match  

Business Analytics – 82% match  

Digital Marketing – 78% match



\---



\## 4. University Recommendation



Based on the selected major, the system suggests universities.



Filtering factors:



\- admission score

\- tuition fee

\- geographic location

\- competitiveness



Output:



List of suitable universities.



\---



\## 5. Admission Probability



The system compares:



student score vs admission score.



Output example:



High chance  

Medium chance  

Low chance



\---



\## 6. Financial Planning



Estimated cost:



\- yearly tuition

\- total cost for 4 years



This helps parents evaluate financial feasibility.



\---



\## 7. Career Roadmap (Premium Feature)



After selecting a target university, the system builds a roadmap.



Roadmap example:



Month 1–3  

Improve mathematics foundation



Month 4–6  

Prepare IELTS



Month 7–12  

Practice mock exams



\---



\## 8. Progress Tracking



Students can track their progress toward target admission score.



Progress table:



| User Score | Target Score | Progress % | Suggested Improvement |

|------------|--------------|------------|-----------------------|

| 23 | 27 | 85% | Improve math + physics |



\---



\## 9. AI Chat Advisor



An AI chatbot helps students:



\- understand results

\- ask about majors

\- ask about universities

\- get study advice



The chatbot uses RAG over:



\- university database

\- career data

\- education knowledge base



\---



\# 4. User Flow



Main user journey:



Landing page  

→ Start career assessment  

→ Complete tests  

→ Input academic data  

→ AI analysis  

→ Recommended majors  

→ Recommended universities  

→ Admission probability  

→ Financial estimation  

→ Career roadmap  

→ Progress tracking



\---



\# 5. Monetization Model



Free tier:



\- basic career test

\- basic career suggestion



Paid tier:



\- full career analysis

\- university recommendation

\- admission probability



Premium tier:



\- career roadmap

\- progress tracking

\- AI advisor



\---



\# 6. High Level System Architecture



Frontend



Web application (React / Next.js)



Backend



API server



Core modules:



\- Assessment engine

\- Career matching engine

\- University ranking engine

\- Admission prediction engine

\- Roadmap generator



AI Layer



\- RAG chatbot

\- recommendation system



Database



\- university data

\- major data

\- admission score history

\- user profiles



\---



\# 7. Key Entities



Student



Fields:



\- personality result

\- interest score

\- academic score

\- subject combination

\- financial ability

\- region preference



Major



\- name

\- required skills

\- typical score requirement

\- career path



University



\- name

\- location

\- majors offered

\- admission score history

\- tuition



\---



\# 8. Design Philosophy



The system should be:



\- simple for students

\- data-driven

\- explainable (AI must explain recommendations)

\- actionable (always provide next steps)



The goal is not only recommendation but \*\*decision support + roadmap\*\*.



\---



\# 9. Important Rule for Codex



When modifying this project:



1\. Do not break the main user flow.

2\. All AI features must support the core concept: \*\*Gap Analysis + Roadmap\*\*.

3\. University recommendations must always consider:

&#x20;  - admission score

&#x20;  - tuition

&#x20;  - location

4\. Any new feature should support student decision making.

