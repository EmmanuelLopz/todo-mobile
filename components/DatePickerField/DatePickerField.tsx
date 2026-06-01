import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const ITEM_HEIGHT    = 44;
const VISIBLE_ITEMS  = 5;
const PICKER_HEIGHT  = ITEM_HEIGHT * VISIBLE_ITEMS;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => String(CURRENT_YEAR + i));

// ─── helpers ──────────────────────────────────────────────────────────────────

function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Parse an ISO datetime string like "2026-06-02T10:30:00" */
function parseDateTime(value: string | null) {
  if (!value) return null;
  const [datePart, timePart = "00:00:00"] = value.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [h, min]  = timePart.split(":").map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return { year: y, month: m - 1, day: d, hour: h ?? 0, minute: min ?? 0 };
}

/** Format as ISO datetime "YYYY-MM-DDTHH:MM:SS" */
function toISO(year: number, month: number, day: number, hour: number, minute: number): string {
  const mm  = String(month + 1).padStart(2, "0");
  const dd  = String(day).padStart(2, "0");
  const hh  = String(hour).padStart(2, "0");
  const min = String(minute).padStart(2, "0");
  return `${year}-${mm}-${dd}T${hh}:${min}:00`;
}

/** Display label shown in the trigger button */
function formatDisplay(value: string | null): string {
  const p = parseDateTime(value);
  if (!p) return "";
  const hh  = String(p.hour).padStart(2, "0");
  const min = String(p.minute).padStart(2, "0");
  return `${MONTHS[p.month]} ${p.day}, ${p.year}  ·  ${hh}:${min}`;
}

// ─── SpinnerColumn ────────────────────────────────────────────────────────────

type SpinnerColumnProps = {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  width: number;
};

function SpinnerColumn({ items, selectedIndex, onSelect, width }: SpinnerColumnProps) {
  const scrollRef = useRef<ScrollView>(null);

  const scrollToIndex = useCallback((index: number, animated = true) => {
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated });
  }, []);

  useEffect(() => {
    setTimeout(() => scrollToIndex(selectedIndex, false), 50);
  }, [selectedIndex, scrollToIndex]);

  const handleMomentumEnd = (e: any) => {
    const y     = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    onSelect(clamped);
    scrollToIndex(clamped, false);
  };

  return (
    <View style={[styles.columnWrapper, { width }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2 }}
      >
        {items.map((label, i) => (
          <TouchableOpacity
            key={`${label}-${i}`}
            onPress={() => { onSelect(i); scrollToIndex(i); }}
            style={styles.columnItem}
            activeOpacity={0.7}
          >
            <Text style={[styles.columnText, i === selectedIndex && styles.columnTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View pointerEvents="none" style={styles.selectionOverlay} />
    </View>
  );
}

// ─── DatePickerField ──────────────────────────────────────────────────────────

type Props = {
  value: string | null;
  onChange: (datetime: string | null) => void;
  placeholder?: string;
  label?: string;
};

export default function DatePickerField({
  value,
  onChange,
  placeholder = "Select date & time",
  label,
}: Props) {
  const [open, setOpen] = useState(false);

  const today  = new Date();
  const [monthIndex,  setMonthIndex]  = useState(today.getMonth());
  const [dayIndex,    setDayIndex]    = useState(today.getDate() - 1);
  const [yearIndex,   setYearIndex]   = useState(0);
  const [hourIndex,   setHourIndex]   = useState(today.getHours());
  const [minuteIndex, setMinuteIndex] = useState(0);

  const openPicker = () => {
    const p = parseDateTime(value);
    if (p) {
      setMonthIndex(p.month);
      setDayIndex(p.day - 1);
      const yi = YEARS.indexOf(String(p.year));
      setYearIndex(yi >= 0 ? yi : 0);
      setHourIndex(p.hour);
      setMinuteIndex(p.minute);
    } else {
      setMonthIndex(today.getMonth());
      setDayIndex(today.getDate() - 1);
      setYearIndex(0);
      setHourIndex(today.getHours());
      setMinuteIndex(0);
    }
    setOpen(true);
  };

  const handleDone = () => {
    const year   = parseInt(YEARS[yearIndex], 10);
    const month  = monthIndex;
    const maxDay = daysInMonth(month, year);
    const day    = Math.min(dayIndex + 1, maxDay);
    onChange(toISO(year, month, day, hourIndex, minuteIndex));
    setOpen(false);
  };

  const handleClear = () => { onChange(null); setOpen(false); };

  const year   = parseInt(YEARS[yearIndex], 10);
  const maxDay = daysInMonth(monthIndex, year);
  const days   = Array.from({ length: maxDay }, (_, i) => String(i + 1));

  return (
    <>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}

      <TouchableOpacity onPress={openPicker} style={styles.trigger} activeOpacity={0.7}>
        <Ionicons name="calendar-outline" size={16} color={value ? "#374151" : "#9CA3AF"} />
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]}>
          {value ? formatDisplay(value) : placeholder}
        </Text>
        {value ? (
          <TouchableOpacity onPress={() => onChange(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
        )}
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.headerClear}>Clear</Text>
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Due Date & Time</Text>
            <TouchableOpacity onPress={handleDone}>
              <Text style={styles.headerDone}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Date row: Month · Day · Year */}
          <Text style={styles.sectionLabel}>DATE</Text>
          <View style={styles.spinnersRow}>
            <SpinnerColumn
              items={MONTHS}
              selectedIndex={monthIndex}
              onSelect={(i) => {
                setMonthIndex(i);
                const md = daysInMonth(i, year);
                if (dayIndex >= md) setDayIndex(md - 1);
              }}
              width={130}
            />
            <SpinnerColumn
              items={days}
              selectedIndex={Math.min(dayIndex, days.length - 1)}
              onSelect={setDayIndex}
              width={56}
            />
            <SpinnerColumn
              items={YEARS}
              selectedIndex={yearIndex}
              onSelect={setYearIndex}
              width={68}
            />
          </View>

          {/* Time row: Hour · : · Minute */}
          <Text style={styles.sectionLabel}>TIME</Text>
          <View style={[styles.spinnersRow, { marginBottom: 8 }]}>
            <SpinnerColumn
              items={HOURS}
              selectedIndex={hourIndex}
              onSelect={setHourIndex}
              width={64}
            />
            <Text style={styles.timeSeparator}>:</Text>
            <SpinnerColumn
              items={MINUTES}
              selectedIndex={minuteIndex}
              onSelect={setMinuteIndex}
              width={64}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  triggerText: { flex: 1, fontSize: 14, color: "#111827" },
  triggerPlaceholder: { color: "#9CA3AF" },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sheetTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  headerClear: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  headerDone:  { fontSize: 14, color: "#2563EB", fontWeight: "700" },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  spinnersRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: PICKER_HEIGHT,
    paddingHorizontal: 20,
    gap: 4,
  },
  timeSeparator: {
    fontSize: 22,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 2,
  },

  columnWrapper: { height: PICKER_HEIGHT, overflow: "hidden", position: "relative" },
  columnItem:    { height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" },
  columnText:    { fontSize: 16, color: "#9CA3AF", textAlign: "center" },
  columnTextSelected: { fontSize: 18, color: "#111827", fontWeight: "600" },
  selectionOverlay: {
    position: "absolute",
    top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    zIndex: -1,
  },
});
