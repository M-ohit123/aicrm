"use client";

import { useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const ImportLeads = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      alert("Please select a CSV file.");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text
        .split("\n")
        .map((row) => row.trim())
        .filter(Boolean);

      if (rows.length < 2) {
        setPreview([]);
        return;
      }

      const headers = rows[0].split(",").map((header) =>
        header.trim()
      );

      const data = rows.slice(1).map((row) => {
        const values = row.split(",");

        const object = {};

        headers.forEach((header, index) => {
          object[header] = values[index]?.trim() || "";
        });

        return object;
      });

      setPreview(data);
    };

    reader.readAsText(selectedFile);
  };

  const handleImport = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    console.log("Importing leads:", preview);

    alert(`${preview.length} leads ready for import!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="min-h-screen md:ml-64">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link
                href="/leads"
                className="hover:text-gray-900"
              >
                Leads
              </Link>

              <span>/</span>

              <span className="text-gray-900">
                Import Leads
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Import Leads
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Upload a CSV file to import multiple leads.
            </p>
          </div>

          <div className="mx-auto max-w-5xl space-y-6">

            {/* Upload Box */}
            <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Upload CSV
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a CSV file containing your lead information.
              </p>

              <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center transition hover:border-gray-400 hover:bg-gray-100">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  📄
                </div>

                <p className="text-sm font-medium text-gray-900">
                  Click to upload CSV
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Only .csv files are supported
                </p>

                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Selected File */}
              {file && (
                <div className="mt-5 flex flex-col gap-3 rounded-lg border bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview([]);
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* CSV Format */}
            <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Required CSV Format
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your CSV should contain these columns.
              </p>

              <div className="mt-5 overflow-x-auto rounded-lg border">
                <table className="min-w-[700px] w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                        name
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                        email
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                        phone
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                        company
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                        status
                      </th>

                      <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                        priority
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm">
                        Rahul Sharma
                      </td>

                      <td className="px-4 py-3 text-sm">
                        rahul@example.com
                      </td>

                      <td className="px-4 py-3 text-sm">
                        9876543210
                      </td>

                      <td className="px-4 py-3 text-sm">
                        ABC Technologies
                      </td>

                      <td className="px-4 py-3 text-sm">
                        New
                      </td>

                      <td className="px-4 py-3 text-sm">
                        High
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Preview */}
            {preview.length > 0 && (
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Preview
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {preview.length} leads found in the CSV file.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[800px] w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(preview[0]).map((header) => (
                          <th
                            key={header}
                            className="px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {preview.slice(0, 10).map((lead, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50"
                        >
                          {Object.values(lead).map(
                            (value, valueIndex) => (
                              <td
                                key={valueIndex}
                                className="px-5 py-3 text-sm text-gray-600"
                              >
                                {value}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {preview.length > 10 && (
                  <div className="border-t px-5 py-3 text-xs text-gray-500">
                    Showing first 10 leads only.
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/leads"
                className="rounded-lg border bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={handleImport}
                disabled={!file}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Import Leads
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImportLeads;