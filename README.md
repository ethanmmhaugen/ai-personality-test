# Personality AI Project

A project dedicated to building AI-driven personality analysis and interaction systems.

## Project Constitution

This project follows a strict constitution-based development process. All features and code changes must comply with the principles defined in [`.specify/memory/constitution.md`](.specify/memory/constitution.md).

### Core Principles

1. **Test-First Development (NON-NEGOTIABLE)**: All code must have tests written before implementation
2. **User-Centric Design**: Features start with prioritized user stories and acceptance criteria
3. **Modular Architecture**: Components must be independently deployable with clear boundaries
4. **Documentation Standards**: Multi-level documentation from specification to implementation
5. **Simplicity & Maintainability**: Favor simple solutions unless complexity is justified

## Development Workflow

1. **Specification** → Create feature spec with user stories (`spec.md`)
2. **Planning** → Create implementation plan with technical design (`plan.md`)
3. **Task Breakdown** → Break feature into discrete tasks (`tasks.md`)
4. **Implementation** → Write tests first, then implement (Red-Green-Refactor)
5. **Review & Integration** → Verify quality gates and merge

## Project Structure

```
project/
├── .specify/
│   ├── memory/
│   │   └── constitution.md      # Project constitution (v1.0.0)
│   ├── templates/
│   │   ├── spec-template.md     # Feature specification template
│   │   ├── plan-template.md     # Implementation plan template
│   │   ├── tasks-template.md    # Task breakdown template
│   │   └── ...
│   └── scripts/
│       └── powershell/          # PowerShell automation scripts
├── specs/                       # Feature specifications (created per feature)
│   └── [###-feature-name]/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── contracts/
└── src/                         # Source code (to be created)
```

## Getting Started

### Prerequisites

Check prerequisites using:

```powershell
.\.specify\scripts\powershell\check-prerequisites.ps1
```

### Creating a New Feature

1. Define your feature requirements
2. Use the specification template to document user stories
3. Create an implementation plan with technical approach
4. Break down into tasks following test-first principles
5. Implement tests before code

## Quality Standards

All code must pass these gates:

- ✅ All tests pass (100% pass rate)
- ✅ Appropriate test coverage (contract & integration tests)
- ✅ Linting and formatting rules
- ✅ Documentation for public interfaces
- ✅ Code review approval

## Constitution Compliance

Every feature must include a Constitution Check verifying compliance with all five principles. Any violations must be explicitly justified.

## Version

**Constitution Version**: 1.0.0  
**Last Updated**: 2025-10-19

## License

[To be determined]
