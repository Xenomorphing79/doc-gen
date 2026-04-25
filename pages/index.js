import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const years = Array.from({ length: 12 }, (_, i) => 2015 + i);
const diaryYears = Array.from({ length: 7 }, (_, i) => 2020 + i);
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
      file_year: "",
      anr: "",
      anr_year: "",
      curr_date: new Date().toLocaleDateString("en-GB").replace(/\//g, "."),
      section: "",
      diary: "",
      diary_day: "",
      diary_month: "",
      diary_year: "",
      case_type: "",
      case_num: "",
      case_year: "",
      party1: "",
      party2: "",
      order_day: "",
      order_month: "",
      order_year: "",
      mediator_title: "Mr.",
      mediator_name: "",
      if_settl: "Settlement Agreement",
      med_day: "",
      med_month: "",
      med_year: "",
      copy_type: "Original Copy",
    };
  }

  const handleChange = (i, field, value) => {
    const updated = [...entries];
    updated[i][field] = value;
    setEntries(updated);
  };

  const addRow = () => setEntries([...entries, getEmptyEntry()]);

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
        <div key={i} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Entry {i + 1}</h5>

            {/* Row 1 */}
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">File No</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(i, "file_no", e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">File Year</label>
                <select
                  className="form-select"
                  onChange={(e) => handleChange(i, "file_year", e.target.value)}
                >
                  <option>Select</option>
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">ANR</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(i, "anr", e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">ANR Year</label>
                <select
                  className="form-select"
                  onChange={(e) => handleChange(i, "anr_year", e.target.value)}
                >
                  <option>Select</option>
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Case Details */}
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <label className="form-label">Case Type</label>
                <select
                  className="form-select"
                  onChange={(e) => handleChange(i, "case_type", e.target.value)}
                >
                  <option>Select</option>
                  <option>Transfer Petition (Civil)</option>
                  <option>Transfer Petition (Criminal)</option>
                  {/* you can edit later */}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Case Number</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(i, "case_num", e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Case Year</label>
                <select
                  className="form-select"
                  onChange={(e) => handleChange(i, "case_year", e.target.value)}
                >
                  <option>Select</option>
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Row 2 */}
            <div className="row g-3 mt-2">
              <div className="col-md-3">
                <label className="form-label">Current Date</label>
                <input
                  className="form-control"
                  value={entry.curr_date}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Section</label>
                <select
                  className="form-select"
                  onChange={(e) => handleChange(i, "section", e.target.value)}
                >
                  <option>Select</option>
                  <option>I</option>
                  <option>IB</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Diary</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(i, "diary", e.target.value)}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <label>Diary Date</label>
                <div className="d-flex gap-2">
                  <input
                    placeholder="DD"
                    className="form-control"
                    onChange={(e) =>
                      handleChange(i, "diary_day", e.target.value)
                    }
                  />
                  <select
                    className="form-select"
                    onChange={(e) =>
                      handleChange(i, "diary_month", e.target.value)
                    }
                  >
                    {months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    className="form-select"
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

              <div className="col-md-4">
                <label>Order Date</label>
                <div className="d-flex gap-2">
                  <input
                    placeholder="DD"
                    className="form-control"
                    onChange={(e) =>
                      handleChange(i, "order_day", e.target.value)
                    }
                  />
                  <select
                    className="form-select"
                    onChange={(e) =>
                      handleChange(i, "order_month", e.target.value)
                    }
                  >
                    {months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    className="form-select"
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

              <div className="col-md-4">
                <label>Mediation Date</label>
                <div className="d-flex gap-2">
                  <input
                    placeholder="DD"
                    className="form-control"
                    onChange={(e) => handleChange(i, "med_day", e.target.value)}
                  />
                  <select
                    className="form-select"
                    onChange={(e) =>
                      handleChange(i, "med_month", e.target.value)
                    }
                  >
                    {months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    className="form-select"
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
            </div>

            {/* Parties */}
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label>Party 1</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(i, "party1", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label>Party 2</label>
                <input
                  className="form-control"
                  onChange={(e) => handleChange(i, "party2", e.target.value)}
                />
              </div>
            </div>

            {/* Mediator */}
            <div className="row g-3 mt-2">
              <div className="col-md-3">
                <label>Title</label>
                <select
                  className="form-select"
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
                  className="form-control"
                  onChange={(e) =>
                    handleChange(i, "mediator_name", e.target.value)
                  }
                />
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
