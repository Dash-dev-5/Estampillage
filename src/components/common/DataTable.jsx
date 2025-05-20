"use client"

import { Table, Spinner } from "react-bootstrap"
import EmptyState from "./EmptyState"

const DataTable = ({ columns, data, loading, emptyStateProps }) => {
  return (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="bg-light">
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" className="me-2" />
                  <span>Chargement...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <EmptyState {...emptyStateProps} />
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="align-middle hover-lift">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{column.cell ? column.cell(row) : row[column.accessor]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default DataTable
