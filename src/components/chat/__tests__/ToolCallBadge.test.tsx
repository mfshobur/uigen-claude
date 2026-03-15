import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

test("str_replace_editor create shows Creating filename", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("str_replace_editor str_replace shows Updating filename", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/src/Card.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Updating Card.jsx")).toBeDefined();
});

test("str_replace_editor insert shows Updating filename", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/src/Card.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Updating Card.jsx")).toBeDefined();
});

test("str_replace_editor view shows Reading filename", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Reading App.jsx")).toBeDefined();
});

test("str_replace_editor undo_edit shows Undoing edit to filename", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Undoing edit to App.jsx")).toBeDefined();
});

test("file_manager delete shows Deleting filename", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/Button.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Deleting Button.jsx")).toBeDefined();
});

test("file_manager rename shows Renaming filename", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "rename", path: "/old.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Renaming old.jsx")).toBeDefined();
});

test("unknown tool shows raw tool name", () => {
  render(
    <ToolCallBadge
      toolName="some_unknown_tool"
      args={{}}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

test("state result with result shows green dot, no spinner", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("state call (pending) shows spinner, no green dot", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
