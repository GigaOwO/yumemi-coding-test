import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CheckBox from "@/features/prefecture/components/CheckBox";

describe("CheckBox", () => {
  const mockOnToggle = vi.fn();
  const defaultProps = {
    prefName: "北海道",
    prefCode: 1,
    onToggle: mockOnToggle,
  };

  it("renders prefecture name correctly", () => {
    render(<CheckBox {...defaultProps} />);
    expect(screen.getByText("北海道")).toBeValid();
  });

  it("renders checkbox with correct id", () => {
    render(<CheckBox {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "1");
  });

  it("calls onToggle with correct parameters when checked", () => {
    render(<CheckBox {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(1, "北海道", true);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onToggle with correct parameters when unchecked", () => {
    render(<CheckBox {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

    // Check first
    fireEvent.click(checkbox);
    mockOnToggle.mockClear();

    // Then uncheck
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(1, "北海道", false);
  });

  it("label is associated with checkbox", () => {
    render(<CheckBox {...defaultProps} />);
    const label = screen.getByText("北海道");
    const checkbox = screen.getByRole("checkbox");

    expect(label).toHaveAttribute("for", "1");
    expect(checkbox).toHaveAttribute("id", "1");
  });

  it("handles different prefecture codes", () => {
    const { rerender } = render(<CheckBox {...defaultProps} />);

    rerender(
      <CheckBox prefName="青森県" prefCode={2} onToggle={mockOnToggle} />
    );

    expect(screen.getByText("青森県")).toBeValid();
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "2");
  });
});
