import { formatTopicLabel } from "../topic-label";

describe("formatTopicLabel", () => {
  it("turns taxonomy tags into readable title case", () => {
    expect(formatTopicLabel("equipment_permissions")).toBe("Equipment Permissions");
    expect(formatTopicLabel("route_planning_shortest")).toBe("Route Planning Shortest");
  });

  it("preserves known acronyms and branded names", () => {
    expect(formatTopicLabel("ivrd_pdpa")).toBe("IVRD PDPA");
    expect(formatTopicLabel("vl_eligibility_obligations")).toBe("VL Eligibility Obligations");
    expect(formatTopicLabel("vlps")).toBe("VLPS");
    expect(formatTopicLabel("sgsecure_app")).toBe("SGSecure App");
  });

  it("does not mutate the raw tag", () => {
    const tag = "ivrd_pdpa";
    formatTopicLabel(tag);
    expect(tag).toBe("ivrd_pdpa");
  });
});
