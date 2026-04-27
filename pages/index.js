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
      diary_reg_year: currentYear,
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

            {/* Row 2 */}
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
                  <option>Civil Appeal</option>
                  <option>Criminal Appeal</option>
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

            {/* Row 3 */}
            <div className="row g-3 mt-2">
              {/* Mediation Date */}
              <div className="col-md-4">
                <label>Mediation Date</label>
                <div className="d-flex gap-2">
                  <input
                    placeholder="DD"
                    className="form-control bg-dark text-light"
                    onChange={(e) => handleChange(i, "med_day", e.target.value)}
                  />
                  <select
                    className="form-select bg-dark text-light"
                    value={entry.med_month}
                    onChange={(e) =>
                      handleChange(i, "med_month", e.target.value)
                    }
                  >
                    {months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    className="form-select bg-dark text-light"
                    value={entry.med_year}
                    onChange={(e) =>
                      handleChange(i, "med_year", e.target.value)
                    }
                  >
                    {diaryYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="col-md-2">
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
                  <option>Dr.</option>
                </select>
              </div>

              {/* Mediator */}
              <div className="col-md-6">
                <label>Mediator Name</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) =>
                    handleChange(i, "mediator_name", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Row 4 */}
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
                  <option>Original</option>
                  <option>Scanned</option>
                </select>
              </div>
            </div>

            {/* Row 5 */}
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

            {/* Row 6 */}
            <div className="row g-3 mt-2">
              <div className="col-md-2">
                <label>Current Date</label>
                <input
                  className="form-control bg-dark text-light"
                  value={entry.curr_date}
                  readOnly
                />
              </div>

              <div className="col-md-2">
                <label>Diary</label>
                <input
                  className="form-control bg-dark text-light"
                  onChange={(e) => handleChange(i, "diary", e.target.value)}
                />
              </div>

              {/* Diary Date */}
              <div className="col-md-3">
                <label>Diary Date</label>
                <div className="d-flex gap-2">
                  <input
                    placeholder="DD"
                    className="form-control bg-dark text-light"
                    onChange={(e) =>
                      handleChange(i, "diary_day", e.target.value)
                    }
                  />
                  <select
                    className="form-select bg-dark text-light"
                    value={entry.diary_month}
                    onChange={(e) =>
                      handleChange(i, "diary_month", e.target.value)
                    }
                  >
                    {months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    className="form-select bg-dark text-light"
                    value={entry.diary_year}
                    onChange={(e) =>
                      handleChange(i, "diary_year", e.target.value)
                    }
                  >
                    {diaryYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-2">
                <label>Section</label>
                <select
                  className="form-select bg-dark text-light"
                  onChange={(e) => handleChange(i, "section", e.target.value)}
                >
                  <option>Select</option>
                  <option>II</option>
                  <option>II-A</option>
                  <option>II-B</option>
                  <option>II-C</option>
                  <option>II-D</option>
                  <option>III</option>
                  <option>III-A</option>
                  <option>III-B</option>
                  <option>III-C</option>
                  <option>III-D</option>
                  <option>IV</option>
                  <option>IV-A</option>
                  <option>IV-B</option>
                  <option>IV-C</option>
                  <option>IV-D</option>
                  <option>V</option>
                  <option>V-A</option>
                  <option>V-B</option>
                  <option>V-C</option>
                  <option>V-D</option>
                  <option>VI</option>
                  <option>VI-A</option>
                  <option>VI-B</option>
                  <option>VI-C</option>
                  <option>VI-D</option>
                  <option>VII</option>
                  <option>VII-A</option>
                  <option>VII-B</option>
                  <option>VII-C</option>
                  <option>VII-D</option>
                  <option>VIII</option>
                  <option>VIII-A</option>
                  <option>VIII-B</option>
                  <option>VIII-C</option>
                  <option>VIII-D</option>
                  <option>IX</option>
                  <option>IX-A</option>
                  <option>IX-B</option>
                  <option>IX-C</option>
                  <option>IX-D</option>
                  <option>X</option>
                  <option>X-A</option>
                  <option>X-B</option>
                  <option>X-C</option>
                  <option>X-D</option>
                  <option>XI</option>
                  <option>XI-A</option>
                  <option>XI-B</option>
                  <option>XI-C</option>
                  <option>XI-D</option>
                  <option>XII</option>
                  <option>XII-A</option>
                  <option>XII-B</option>
                  <option>XIII</option>
                  <option>XIII-A</option>
                  <option>XIII-B</option>
                  <option>XIV</option>
                  <option>XIV-A</option>
                  <option>XIV-B</option>
                  <option>XV</option>
                  <option>XV-A</option>
                  <option>XV-B</option>
                  <option>XVI</option>
                  <option>XVI-A</option>
                  <option>XVI-B</option>
                  <option>XVII</option>
                  <option>XVII-A</option>
                  <option>XVII-B</option>
                  <option>XVIII</option>
                  <option>XVIII-A</option>
                  <option>XVIII-B</option>
                  <option>XIX</option>
                  <option>XIX-A</option>
                  <option>XIX-B</option>
                  <option>XX</option>
                  <option>XX-A</option>
                  <option>XX-B</option>
                </select>
              </div>

              {/* Order Date */}
              <div className="col-md-3">
                <label>Order Date</label>
                <div className="d-flex gap-2">
                  <input
                    placeholder="DD"
                    className="form-control bg-dark text-light"
                    onChange={(e) =>
                      handleChange(i, "order_day", e.target.value)
                    }
                  />
                  <select
                    className="form-select bg-dark text-light"
                    value={entry.order_month}
                    onChange={(e) =>
                      handleChange(i, "order_month", e.target.value)
                    }
                  >
                    {months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    className="form-select bg-dark text-light"
                    value={entry.order_year}
                    onChange={(e) =>
                      handleChange(i, "order_year", e.target.value)
                    }
                  >
                    {diaryYears.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
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
