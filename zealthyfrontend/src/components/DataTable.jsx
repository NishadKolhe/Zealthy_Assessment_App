import "../styles/DataTable.css";

export default function DataTable({
  title,
  titleAction,
  columns,
  data,
  keyField = "id",
  footerAction,
}) {
  return (
    <div className="datatable-container">
      <div className="datatable-title-wrapper">
        {title && <h2 className="datatable-title">{title}</h2>}
        {titleAction && (
          <div className="datatable-title-action">{titleAction}</div>
        )}
      </div>

      <div className="datatable-wrapper">
        <table className="datatable">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data && data.length > 0 ? (
              data.map((row) => (
                <tr key={`${row[keyField]}-${row._rowKey ?? ""}`}>
                  {columns.map((col, index) => (
                    <td key={index}>
                      {col.render
                        ? col.render(row)
                        : typeof col.accessor === "function"
                          ? col.accessor(row)
                          : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="datatable-empty">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {footerAction && <div className="datatable-footer">{footerAction}</div>}
    </div>
  );
}
