import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPDF = (result) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AI Feedback Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  // Summary
  doc.setFontSize(16);
  doc.text("Summary", 14, 45);

  doc.setFontSize(11);
  doc.text(result.summary || "No Summary", 14, 55, {
    maxWidth: 180,
  });

  let y = 90;

  // Problems
  doc.setFontSize(16);
  doc.text("Recurring Problems", 14, y);

  y += 8;

  result.recurringProblems?.forEach((item) => {
    doc.setFontSize(11);
    doc.text(`• ${item}`, 18, y);
    y += 7;
  });

  y += 5;

  // Themes
  doc.setFontSize(16);
  doc.text("Themes", 14, y);

  y += 10;

  autoTable(doc, {
    startY: y,
    head: [["Theme", "Occurrences"]],
    body:
      result.themes?.map((item) => [
        item.theme,
        item.occurrences,
      ]) || [],
  });

  y = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(16);
  doc.text("Recommended Actions", 14, y);

  y += 10;

  result.recommendedActions?.forEach((item) => {
    doc.text(`• ${item}`, 18, y);
    y += 7;
  });

  doc.save("AI_Feedback_Report.pdf");
};