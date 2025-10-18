import { describe, it, expect } from "vitest";
import { formatToISO8601 } from "@/utils/dateTimeFormatter";

describe("DateTime Formatter", () => {
  it("should convert MySQL datetime to ISO 8601 with UTC", () => {
    const mysqlDateTime = "2025-05-11 16:02:33";
    const iso8601 = formatToISO8601(mysqlDateTime);
    
    expect(iso8601).toBe("2025-05-11T16:02:33.000Z");
  });

  it("should handle datetime with milliseconds", () => {
    const mysqlDateTime = "2025-05-11 16:02:33.123";
    const iso8601 = formatToISO8601(mysqlDateTime);
    
    expect(iso8601).toBe("2025-05-11T16:02:33.123Z");
  });

  it("should handle already ISO 8601 formatted string", () => {
    const isoDateTime = "2025-05-11T16:02:33.000Z";
    const iso8601 = formatToISO8601(isoDateTime);
    
    expect(iso8601).toBe("2025-05-11T16:02:33.000Z");
  });

  it("should handle ISO 8601 string produced by Date#toISOString()", () => {
    const date = new Date("2025-05-11T16:02:33.000Z");
    const iso8601 = formatToISO8601(date.toISOString());
    
    expect(iso8601).toBe("2025-05-11T16:02:33.000Z");
  });

  it("should produce W3C compliant dateTime format", () => {
    const mysqlDateTime = "2025-05-11 16:02:33";
    const iso8601 = formatToISO8601(mysqlDateTime);
    
    // W3C format: YYYY-MM-DDTHH:mm:ss.sssZ
    expect(iso8601).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
