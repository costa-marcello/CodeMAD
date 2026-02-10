# UI Component Inventory

<!-- Extracted from packages/ui/CLAUDE.md | 2026-02-06 -->

### Primitives

| Component    | Purpose                                   |
| ------------ | ----------------------------------------- |
| `Button`     | Primary action button with icon support   |
| `IconButton` | Icon-only button for compact actions      |
| `Icon`       | 70+ inline SVG icons with size variants   |
| `Tag`        | Inline label/badge for status or category |
| `Keybind`    | Styled keyboard shortcut display          |
| `Avatar`     | User/entity avatar with image or fallback |
| `Card`       | Container with semantic variants          |
| `Spinner`    | Animated 4x4 grid loading indicator       |

### Forms

| Component     | Purpose                                      |
| ------------- | -------------------------------------------- |
| `TextField`   | Text input with label, description, copyable |
| `Checkbox`    | Checkbox with label and description          |
| `Switch`      | Toggle switch with label                     |
| `RadioGroup`  | Radio button group selection                 |
| `Select`      | Dropdown select with grouping support        |
| `InlineInput` | Minimal inline text input                    |

### Overlays

| Component      | Purpose                                |
| -------------- | -------------------------------------- |
| `Dialog`       | Modal dialog with title and actions    |
| `Popover`      | Positioned content with trigger        |
| `Tooltip`      | Hover hint with optional keybind       |
| `HoverCard`    | Rich content on hover                  |
| `DropdownMenu` | Context/action menu with submenus      |
| `Toast`        | Notification toasts with `showToast()` |

### Layout

| Component               | Purpose                             |
| ----------------------- | ----------------------------------- |
| `Accordion`             | Collapsible content sections        |
| `Collapsible`           | Single collapsible region           |
| `Tabs`                  | Tabbed content switching            |
| `List`                  | Keyboard-navigable list with search |
| `ResizeHandle`          | Draggable panel resize handle       |
| `StickyAccordionHeader` | Sticky header for accordion items   |

### Content

| Component        | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `Markdown`       | Rendered markdown with code copy          |
| `Code`           | Syntax-highlighted code with line numbers |
| `Diff`           | Side-by-side/unified diff viewer          |
| `DiffChanges`    | Diff summary with expand/collapse         |
| `Typewriter`     | Animated typing effect                    |
| `ProgressCircle` | Circular progress indicator               |
| `ImagePreview`   | Image display with zoom                   |

### Domain-Specific

| Component       | Purpose                               |
| --------------- | ------------------------------------- |
| `SessionTurn`   | Chat turn with tool calls and results |
| `MessagePart`   | Individual message content parts      |
| `SessionReview` | Session summary and review UI         |
| `BasicTool`     | Tool call display with input/output   |
| `MessageNav`    | Navigation between messages           |
| `LineComment`   | Inline code comment display           |

### Icons

| Component      | Purpose                       |
| -------------- | ----------------------------- |
| `FileIcon`     | File type icon from extension |
| `ProviderIcon` | LLM provider logo icons       |
| `Favicon`      | Website favicon from URL      |
| `Logo`         | App logo component            |
| `Font`         | Font asset loader             |
