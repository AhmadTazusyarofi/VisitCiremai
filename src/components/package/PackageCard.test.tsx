import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { PackageCard } from "./PackageCard";
import type { Package } from "../../types/package";

const pkg: Package = {
  id: "x",
  title: "Privat Trip",
  category: "Pendakian Gunung Hutan",
  price: 2200000,
  priceUnit: "Orang",
  duration: "2 hari 1 malam",
  image: "/img/placeholder.png",
  description: "desc",
};

describe("PackageCard", () => {
  it("shows title, formatted price and duration", () => {
    render(
      <MemoryRouter>
        <PackageCard pkg={pkg} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Privat Trip")).toBeInTheDocument();
    expect(screen.getByText(/Rp2\.200\.000/)).toBeInTheDocument();
    expect(screen.getByText(/2 hari 1 malam/)).toBeInTheDocument();
  });
});
