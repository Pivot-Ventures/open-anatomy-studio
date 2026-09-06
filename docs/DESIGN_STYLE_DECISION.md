# Design decision: a multidisciplinary 3D learning studio

## 1. Core conclusion

The product is a learning studio, not a model viewer. The 3D stage is the centre of attention, but its value comes from the structured content around it: named structures with plain-English meanings, descriptive terms, facts with sources, guided tasks, and quick checks. Anatomy is the first discipline; the content contract in `app/lib/learning.ts` is discipline-agnostic so other subjects can reuse the same lesson, activity, and assessment shapes.

## 2. Brand and scope boundaries

- The studio ships inside the EASI Human Atlas desk as the Organs tab and uses the Human Atlas name.
- It is not a game, not a social product, and not a diagnostic tool. No fictional rewards, mascots, or streaks.
- Target users are secondary-school students and teachers following the NCDC biology syllabus, plus anyone learning anatomy for the first time.
- Content is English only. Every visible string lives in `app/lib/copy.ts` or the organ catalogue.

## 3. Value proposition

1. Real reference geometry from the Human Reference Atlas, slimmed for classroom connections but with every named structure intact.
2. Lifelike tissue rendering so a heart looks like a heart, with a colour-coded alternative for telling parts apart.
3. Functions that answer real questions: what is this part, what is inside, how do the parts fit together, what does the word mean.
4. Auditable sources and licences shown in the product.

## 4. Core learning loop

Locate a labelled structure, observe by sectioning or exploding the model, explain by answering a quiz. Lessons record each step and show progress; the same loop applies to every organ even without a scripted lesson.

## 5. Content architecture

- Discipline to topic to lesson to scene to activity to assessment, each with source references.
- Organ catalogue entries carry summary, role, facts, functions, descriptive terms, labels anchored to mesh names, and a quiz.
- A structure glossary maps model identifiers to labels and meanings so new models gain vocabulary without new UI.

## 6. What is deliberately excluded

- Whole-body or external genital anatomy.
- Diagnostic language or clinical advice.
- Server-side state: settings, favourites, and progress stay in the browser.
