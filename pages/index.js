import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const currentYear = new Date().getFullYear().toString();

const years = Array.from({ length: 12 }, (_, i) => 2015 + i).reverse();
const diaryYears = Array.from({ length: 7 }, (_, i) => 2020 + i).reverse();

const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export default function Home() {
  const [entries, setEntries] = useState([getEmptyEntry()]);

  function getEmptyEntry() {
    return {
      file_no: "",
      file_year: currentYear,
      anr: "",
      anr_year: currentYear,
      curr_date: new Date().toLocaleDateString("en-GB").replace(/\//g, "."),
      section: "",
      diary: "",
      diary_day: "",
      diary_month: "01",
      diary_year: currentYear,
      case_type: "",
      case_num: "",
      case_year: currentYear,
      party1: "",
      party2: "",
      order_day: "",
      order_month: "01",
      order_year: currentYear,
      mediator_title: "Mr.",
      mediator_name: "",
      if_settl: "Mediation Report",
      med_day: "",
      med_month: "01",
      med_year: currentYear,
      copy_type: "Original Copy",
    };
  }

  const handleChange = (i, field, value) => {
    const updated = [...entries];
    updated[i][field] = value;
    setEntries(updated);
  };

  const addRow = () => setEntries([...entries, getEmptyEntry()]);

  const copyPreviousRow = (i) => {
    if (i === 0) return;
    const updated = [...entries];
    updated[i] = { ...entries[i - 1] };
    setEntries(updated);
  };

  const buildPayload = () =>
    entries.map((e) => ({
      ...e,
      diary_date: `${e.diary_day}.${e.diary_month}.${e.diary_year}`,
      order_date: `${e.order_day}.${e.order_month}.${e.order_year}`,
      med_date: `${e.med_day}.${e.med_month}.${e.med_year}`,
      mediator_name: `${e.mediator_title} ${e.mediator_name}`,
    }));

  const generate = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: buildPayload() }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "documents.zip";
    a.click();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📄 Document Generator</h2>

      {entries.map((entry, i) => (
        <div key={i} className="card mb-4 shadow-sm bg-secondary text-light">
          <div className="card-body">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Entry {i + 1}</h5>
              {i > 0 && (
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => copyPreviousRow(i)}
                >
                  Copy Previous
                </button>
              )}
            </div>

            {/* Row 1 */}
            <div className="row g-3">
              <div className="col-md-3">
                <label>File No</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) => handleChange(i, "file_no", e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label>File Year</label>
                <select
                  className="form-select bg-dark text-light"
                  value={entry.file_year}
                  onChange={(e) => handleChange(i, "file_year", e.target.value)}
                >
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label>ANR</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) => handleChange(i, "anr", e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label>ANR Year</label>
                <select
                  className="form-select bg-dark text-light"
                  value={entry.anr_year}
                  onChange={(e) => handleChange(i, "anr_year", e.target.value)}
                >
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Case */}
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <label>Case Type</label>
                <select
                  className="form-select bg-dark text-light"
                  onChange={(e) => handleChange(i, "case_type", e.target.value)}
                >
                  <option>Select</option>
                  <option>Transfer Petition (Civil)</option>
                  <option>Transfer Petition (Criminal)</option>
                  <option>Special Leave Petition (Civil)</option>
                  <option>Special Leave Petition (Criminal)</option>
                </select>
              </div>

              <div className="col-md-4">
                <label>Case Number</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) => handleChange(i, "case_num", e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label>Case Year</label>
                <select
                  className="form-select bg-dark text-light"
                  value={entry.case_year}
                  onChange={(e) => handleChange(i, "case_year", e.target.value)}
                >
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="row g-3 mt-2">
              <div className="col-md-3">
                <label>Current Date</label>
                <input
                  className="form-control bg-dark text-light"
                  value={entry.curr_date}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label>Section</label>
                <select
                  className="form-select bg-dark text-light"
                  onChange={(e) => handleChange(i, "section", e.target.value)}
                >
                  <option>Select</option>
                  <option>II-A</option>
                  <option>II-B</option>
                  <option>IV-A</option>
                  <option>IV-B</option>
                </select>
              </div>

              <div className="col-md-3">
                <label>Diary</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) => handleChange(i, "diary", e.target.value)}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="row g-3 mt-2">
              {["diary", "order", "med"].map((type) => (
                <div className="col-md-4" key={type}>
                  <label>
                    {type === "diary"
                      ? "Diary Date"
                      : type === "order"
                        ? "Order Date"
                        : "Mediation Date"}
                  </label>
                  <div className="d-flex gap-2">
                    <input
                      placeholder="DD"
                      className="form-control bg-dark text-light"
                      onChange={(e) =>
                        handleChange(i, `${type}_day`, e.target.value)
                      }
                    />

                    <select
                      className="form-select bg-dark text-light"
                      value={entry[`${type}_month`]}
                      onChange={(e) =>
                        handleChange(i, `${type}_month`, e.target.value)
                      }
                    >
                      {months.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>

                    <select
                      className="form-select bg-dark text-light"
                      value={entry[`${type}_year`]}
                      onChange={(e) =>
                        handleChange(i, `${type}_year`, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {diaryYears.map((y) => (
                        <option key={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Parties */}
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label>Party 1</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) => handleChange(i, "party1", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label>Party 2</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) => handleChange(i, "party2", e.target.value)}
                />
              </div>
            </div>

            {/* Mediator */}
            <div className="row g-3 mt-2">
              <div className="col-md-3">
                <label>Title</label>
                <select
                  className="form-select bg-dark text-light"
                  value={entry.mediator_title}
                  onChange={(e) =>
                    handleChange(i, "mediator_title", e.target.value)
                  }
                >
                  <option>Mr.</option>
                  <option>Ms.</option>
                </select>
              </div>
              <div className="col-md-9">
                <label>Mediator Name</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) =>
                    handleChange(i, "mediator_name", e.target.value)
                  }
                />
              </div>
            </div>
            {/* Settlement + Copy Type */}
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label>Document Type</label>
                <select
                  className="form-select bg-dark text-light"
                  value={entry.if_settl}
                  onChange={(e) => handleChange(i, "if_settl", e.target.value)}
                >
                  <option>Settlement Agreement</option>
                  <option>Mediation Report</option>
                </select>
              </div>

              <div className="col-md-6">
                <label>Copy Type</label>
                <select
                  className="form-select bg-dark text-light"
                  value={entry.copy_type}
                  onChange={(e) => handleChange(i, "copy_type", e.target.value)}
                >
                  <option>Original Copy</option>
                  <option>Scanned Copy</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex gap-2">
        <button className="btn btn-secondary" onClick={addRow}>
          Add Row
        </button>
        <button className="btn btn-primary" onClick={generate}>
          Generate ZIP
        </button>
      </div>
    </div>
  );
}
