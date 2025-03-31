# Directory Renaming Plan

## Objective

Standardize the naming convention for chapter directories under the `public/` folder and ensure all references within the project are updated accordingly. Proceed chapter by chapter, verifying each change before moving on.

## Target Convention

`Ch<number>` or `Ch<number> (<part>:<total>)`
- No space after "Ch".
- A space before the parenthesis `()` if present.

## Required Changes

1.  `public/Ch27 (1:3)` (Completed)
2.  `public/Ch27 (3:3)` (Completed)
3.  `public/Ch17 (1:3)` (Completed)
4.  `public/Ch17 (3:3)` (Completed)
5.  `public/Ch18` (Completed)
6.  `public/Ch4` (Completed)
7.  `public/Ch6` (Completed)

## Process (Per Directory)

1.  **Rename Directory:** Rename the folder itself.
2.  **Search References:** Search the project codebase for references to the *old* directory name.
3.  **Update References:** Update any found references to point to the *new* directory name.
4.  **Verification Pause:** Pause for user verification after each directory is processed.
5.  **Proceed:** Move to the next directory upon confirmation.

## Process Flowchart

```mermaid
graph TD
    A[Start Rename for Directory X] --> B{Rename Directory X};
    B --> C{Search Project for References to Old Path};
    C --> D{References Found?};
    D -- Yes --> E{Update References in Files};
    D -- No --> F[Verification Pause];
    E --> F;
    F --> G{User Confirms?};
    G -- Yes --> H[Proceed to Next Directory];
    G -- No --> I{Address Issues/Revert};
    I --> F;
    H --> A;