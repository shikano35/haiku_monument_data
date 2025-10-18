import { formatToISO8601, formatToXSDDate } from "@/utils/dateTimeFormatter";
import { describe, expect, it } from "vitest";

describe("DateTime Formatter", () => {
  describe("formatToISO8601", () => {
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

    it("should return null for null input", () => {
      expect(formatToISO8601(null)).toBeNull();
    });

    it("should return null for undefined input", () => {
      expect(formatToISO8601(undefined)).toBeNull();
    });

    it("should return null for invalid date string", () => {
      expect(formatToISO8601("invalid-date")).toBeNull();
    });

    it("should return null for malformed ISO 8601 string", () => {
      expect(formatToISO8601("2025-13-45T99:99:99.000Z")).toBeNull();
    });
  });

  describe("formatToXSDDate", () => {
    it("should convert date string to xsd:date format (YYYY-MM-DD)", () => {
      const dateString = "2025-05-11T16:02:33.000Z";
      const xsdDate = formatToXSDDate(dateString);

      expect(xsdDate).toBe("2025-05-11");
    });

    it("should handle simple date format", () => {
      const dateString = "2025-05-11";
      const xsdDate = formatToXSDDate(dateString);

      expect(xsdDate).toBe("2025-05-11");
    });

    it("should return null for null input", () => {
      expect(formatToXSDDate(null)).toBeNull();
    });

    it("should return null for undefined input", () => {
      expect(formatToXSDDate(undefined)).toBeNull();
    });

    it("should return null for invalid date string", () => {
      expect(formatToXSDDate("invalid-date")).toBeNull();
    });

    it("should handle edge case dates", () => {
      const newYear = formatToXSDDate("2025-01-01T00:00:00.000Z");
      expect(newYear).toBe("2025-01-01");

      const endOfYear = formatToXSDDate("2025-12-31T23:59:59.999Z");
      expect(endOfYear).toBe("2025-12-31");
    });
  });
});
