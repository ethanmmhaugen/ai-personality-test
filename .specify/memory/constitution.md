<!--
═══════════════════════════════════════════════════════════════════════════════
SYNC IMPACT REPORT
═══════════════════════════════════════════════════════════════════════════════
Version Change: [NEW] → 1.0.0 (Initial Constitution)
Version Bump Rationale: MINOR - Initial constitution creation with foundational principles

Modified Principles:
- [NEW] I. Test-First Development (NON-NEGOTIABLE)
- [NEW] II. User-Centric Design
- [NEW] III. Modular Architecture
- [NEW] IV. Documentation Standards
- [NEW] V. Simplicity & Maintainability

Added Sections:
- Core Principles (5 principles)
- Quality Standards
- Development Workflow
- Governance

Removed Sections: None (initial creation)

Template Sync Status:
✅ plan-template.md - Constitution Check section aligned with principles
✅ spec-template.md - User scenarios and requirements sections support test-first approach
✅ tasks-template.md - Test tasks properly sequenced before implementation tasks
✅ agent-file-template.md - No changes required

Follow-up TODOs: None

Change Summary:
This is the initial ratification of the Personality AI Project Constitution. The core
principle of test-first development has been established as non-negotiable, ensuring
all code development begins with test case creation. Additional principles support
modularity, user-centric design, documentation, and simplicity.

═══════════════════════════════════════════════════════════════════════════════
-->

# Personality AI Project Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

When writing code, start by creating test cases first and use the test cases to ensure that code works as expected.

**Rules:**

- Tests MUST be written before implementation code
- Tests MUST fail initially (red phase)
- Implementation proceeds only after tests are approved and failing
- All tests MUST pass before code is considered complete (green phase)
- Red-Green-Refactor cycle is strictly enforced

**Rationale:** Test-first development ensures code correctness, provides living documentation, enables confident refactoring, and prevents regression. By writing tests first, we clarify requirements before implementation and create a safety net for future changes.

### II. User-Centric Design

All features MUST start with clearly defined user scenarios and acceptance criteria before technical design begins.

**Rules:**

- User stories MUST be prioritized (P1, P2, P3) by value and importance
- Each user story MUST be independently testable and deliverable
- Acceptance scenarios MUST use Given-When-Then format
- Edge cases and error scenarios MUST be explicitly documented
- Success criteria MUST be measurable and technology-agnostic

**Rationale:** Starting with user needs ensures we build the right thing. Independent, prioritized stories enable incremental delivery and allow teams to ship MVP features that deliver value early.

### III. Modular Architecture

Features MUST be designed as modular, independently deployable components with clear boundaries.

**Rules:**

- Each module MUST have a single, well-defined responsibility
- Dependencies between modules MUST be explicit and minimal
- Modules MUST be independently testable
- Public interfaces (APIs, contracts) MUST be documented before implementation
- Shared code MUST be justified and kept to a minimum

**Rationale:** Modular design enables parallel development, easier testing, independent deployment, and simplified maintenance. Clear boundaries reduce coupling and make systems easier to understand and modify.

### IV. Documentation Standards

Code and features MUST be documented at multiple levels: specification, design, and implementation.

**Rules:**

- Every feature MUST have a specification document (spec.md) with user stories
- Every feature MUST have an implementation plan (plan.md) with technical context
- Public interfaces MUST have contract documentation
- Code MUST include inline comments for complex logic
- README or quickstart documentation MUST be provided for user-facing features

**Rationale:** Documentation at multiple levels serves different audiences and purposes. Specifications capture intent, plans guide implementation, and code comments explain complex details. This creates a complete knowledge base for current and future developers.

### V. Simplicity & Maintainability

Favor simple, straightforward solutions over complex architectures unless complexity is explicitly justified.

**Rules:**

- Start with the simplest solution that meets requirements (YAGNI principle)
- Complex patterns (e.g., repositories, factories) MUST be justified in writing
- Code MUST be readable and follow consistent style guidelines
- Abstractions MUST provide clear value (reusability, testability, or clarity)
- Technical debt MUST be documented when incurred

**Rationale:** Simple code is easier to understand, test, debug, and maintain. Unnecessary complexity increases cognitive load and maintenance burden. Complexity should only be introduced when simpler alternatives have been tried and found insufficient.

## Quality Standards

### Code Quality Gates

All code changes MUST pass the following gates before merging:

- **Tests Pass**: All existing and new tests pass (100% pass rate required)
- **Test Coverage**: New code includes appropriate test coverage
- **Linting**: Code passes all configured linters and formatters
- **Documentation**: Public interfaces and complex logic are documented
- **Review**: Code reviewed by at least one other developer

### Testing Standards

Testing MUST follow this hierarchy:

1. **Contract Tests**: Verify public interfaces and API contracts
2. **Integration Tests**: Verify interactions between modules
3. **Unit Tests**: Verify individual functions and methods (optional, as needed)

Contract and integration tests take priority over unit tests because they provide higher value in catching real-world issues.

## Development Workflow

### Feature Development Process

1. **Specification Phase**

   - Create feature specification (spec.md) with user stories and acceptance criteria
   - Prioritize user stories (P1 = MVP, P2+ = enhancements)
   - Get specification approved before proceeding

2. **Planning Phase**

   - Create implementation plan (plan.md) with technical approach
   - Document project structure and key design decisions
   - Verify constitution compliance (run Constitution Check)
   - Justify any complexity or principle violations

3. **Task Breakdown Phase**

   - Break feature into discrete tasks (tasks.md)
   - Organize tasks by user story for independent delivery
   - Identify parallel work opportunities
   - Sequence test tasks before implementation tasks

4. **Implementation Phase**

   - Write tests FIRST (must fail initially)
   - Implement functionality until tests pass
   - Refactor while maintaining passing tests
   - Complete user stories in priority order (P1 first)
   - Validate each story independently before proceeding

5. **Review & Integration Phase**
   - Verify all quality gates pass
   - Conduct code review
   - Update documentation if needed
   - Merge to main branch

### Branching Strategy

- Feature branches: `[###-feature-name]` (3-digit feature ID)
- Feature branches MUST include complete specification and plan
- No direct commits to main/master

## Governance

### Amendment Procedure

This constitution supersedes all other development practices and guidelines.

**To amend this constitution:**

1. Propose amendment with clear rationale
2. Document impact on existing practices and templates
3. Update all affected templates and documentation
4. Increment version number appropriately:
   - **MAJOR**: Breaking changes to principles (removals, incompatible redefinitions)
   - **MINOR**: New principles, substantial additions to existing principles
   - **PATCH**: Clarifications, wording improvements, non-semantic changes
5. Update LAST_AMENDED_DATE to change date
6. Create Sync Impact Report documenting all changes

### Compliance Review

All feature plans MUST include a "Constitution Check" section verifying compliance with these principles. Any violations MUST be explicitly justified with:

- What principle is being violated
- Why the violation is necessary
- What simpler alternatives were considered and rejected

### Version Control

Constitution changes MUST be tracked in version control with clear commit messages following the format:

```
docs: amend constitution to vX.Y.Z (brief change summary)
```

**Version**: 1.0.0 | **Ratified**: 2025-10-19 | **Last Amended**: 2025-10-19
