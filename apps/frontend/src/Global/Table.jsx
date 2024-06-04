import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
export default function Table(props) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={props.rows}
        onRowSelectionModelChange={(newSelection) =>
          props.onSelectionChange(newSelection)
        }
        columns={props.columns}
        initialState={{
          pagination: {
            paginationModel: {
              page: props.initialPage,
              pageSize: props.pageSize,
            },
          },
        }}
        pageSizeOptions={props.pageSizeOptions}
        checkboxSelection = {props.checkboxSelection}
      />
    </div>
  );
}

Table.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
  onSelectionChange: PropTypes.func,
  checkboxSelection: PropTypes.bool,
  pageSizeOptions:  PropTypes.array
};
