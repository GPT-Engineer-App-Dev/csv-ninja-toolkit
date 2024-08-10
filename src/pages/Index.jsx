import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Download, Plus } from 'lucide-react';

const CSVManager = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (result) => {
        setHeaders(result.data[0]);
        setCsvData(result.data.slice(1));
      },
      header: false,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleEdit = (rowIndex, columnIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][columnIndex] = value;
    setCsvData(newData);
  };

  const handleAddRow = () => {
    const newRow = new Array(headers.length).fill('');
    setCsvData([...csvData, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const newData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse([headers, ...csvData]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'exported_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV File Manager</h1>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here ...</p>
        ) : (
          <p>Drag 'n' drop a CSV file here, or click to select a file</p>
        )}
      </div>
      {csvData.length > 0 && (
        <div>
          <Table className="w-full mb-4">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-2">{header}</th>
                ))}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border px-4 py-2">
                      <Input
                        value={cell}
                        onChange={(e) => handleEdit(rowIndex, cellIndex, e.target.value)}
                        className="w-full"
                      />
                    </td>
                  ))}
                  <td className="border px-4 py-2">
                    <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex justify-between mb-4">
            <Button onClick={handleAddRow}>
              <Plus className="h-4 w-4 mr-2" /> Add Row
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVManager;