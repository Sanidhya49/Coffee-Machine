# Coffee Machine Portal - Architecture Diagrams

You can use these Mermaid diagrams to visualize the architecture, data flow, and state transitions of the application. If your markdown viewer supports Mermaid, these will map out automatically!

## 1. High-Level System Architecture

This diagram shows the overall structure of the React Frontend, FastAPI Backend, and SQLite Database.

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef database fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    %% Components
    A[Browser / Client]:::frontend

    subgraph Frontend [React SPA - Vite]
        B[React Router]
        C[Pages: Dashboard, View, Add, Compare]
        D[Axios API Client]
        B --> C
        C --> D
    end

    subgraph Backend [FastAPI Server]
        E[FastAPI Routers]
        F[Pydantic Models validation]
        G[SQLAlchemy ORM]
        E --> F
        F --> G
    end

    H[(SQLite Database)]:::database

    %% Connections
    A -->|HTTP / SPA Load| B
    D -->|RESTful JSON Requests \n GET, POST, PUT, DELETE| E
    G -->|SQL Queries| H
```

## 2. The Two-Level Approval State Machine

This diagram shows the strict lifecycle of a `Machine` entity and the roles that govern its `status`.

```mermaid
stateDiagram-v2
    %% Direction
    direction TB

    %% States
    state "Empty State" as Empty
    state "New" as New
    state "Pending Level 2" as PendingL2
    state "Approved" as Approved
    state "Pending Deletion" as PendingDel
    state "Rejected" as Rejected
    state "Deleted (Removed from DB)" as Deleted

    %% Transitions
    Empty --> New: L1 or Admin adds machine
    
    New --> Approved: L2 or Admin approves
    New --> Rejected: L2 or Admin rejects
    New --> Deleted: L1 or Admin deletes (Directly)
    
    Approved --> PendingL2: L1 edits existing machine
    Approved --> PendingDel: L1 requests deletion
    
    PendingL2 --> Approved: L2 approves edits
    PendingL2 --> Rejected: L2 rejects edits
    
    PendingDel --> Deleted: L2 confirms deletion
    PendingDel --> Approved: L2 rejects deletion (Keeps machine)
    
    Rejected --> Deleted: L1, L2, or Admin deletes permanently
```

## 3. Data Flow: Adding a New Machine

This sequence diagram illustrates the step-by-step traffic when an L1 User submits a new coffee machine.

```mermaid
sequenceDiagram
    participant U as L1 Reviewer
    participant UI as React Frontend
    participant API as FastAPI Backend
    participant DB as SQLite Config

    U->>UI: Fills out Add Machine Form
    U->>UI: Clicks "Submit"
    UI->>API: POST /machines (JSON Payload)
    
    activate API
    API->>API: Validates data (Pydantic Schema)
    alt Validation Fails
        API-->>UI: 422 Unprocessable Entity
        UI-->>U: Shows Validation Error
    else Validation Succeeds
        API->>DB: INSERT INTO machines (Status: 'New')
        activate DB
        DB-->>API: Returns inserted row ID
        deactivate DB
        API-->>UI: 200 OK (Machine object)
    end
    deactivate API
    
    UI->>UI: Redirects to Dashboard
    UI-->>U: Shows success popup & updated list
```

## 4. Frontend Component Tree

This maps out how the React UI is structured and nested.

```mermaid
graph TD
    App[App.jsx] --> Router[React Router]
    
    Router --> Layout[Main Layout]
    
    Layout --> Nav[Navigation Bar]
    Layout --> MainContent[Main Content Area]
    
    MainContent --> Landing[LandingPage.jsx]
    MainContent --> Dash[Dashboard.jsx]
    MainContent --> Add[AddMachine.jsx]
    MainContent --> View[ViewMachine.jsx]
    MainContent --> Edit[EditReviewMachine.jsx]
    MainContent --> Compare[CompareMachines.jsx]

    Dash --> Filter[Search & Status Filters]
    Dash --> Grid[Inventory Grid]
    Grid --> Card[MachineCard.jsx x N]
    Dash --> CompareBar[Floating Compare Action Bar]
```
