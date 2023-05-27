import { forwardRef } from 'react'
import Logo from "../../assets/logo.jpeg"
import './Print.css'

const ContentToPrint = forwardRef((props, ref) => {

  return (
    <div tabIndex={"1"} className="print-container" ref={ref}>
      <div className="header">
        <img src={Logo} alt="Bricks & bridges logo" style={{"width": "200px", "height": "78px"}} />
        <div className="header-info">
          <h1>Project Quality Plan</h1>
          <h2>Daily Progress Report</h2>
          <h2>Date: {Date(props.reportData.created[1]).split(" ").slice(0, 4).map(data => ` ${data}`)}</h2>
        </div>
      </div>

      <hr />

      <div className="table">
        <div className="section">
          <div className="section-header">
            PROJECT
          </div>
          <div className="section-body">
            <div className="row">
              <div className="th">Name of work</div>
              <div className="td">{props.reportData.project_name}</div>
            </div>

            <div className="row">
              <div className="th">Employer</div>
              <div className="td">{props.reportData.employer}</div>
            </div>

            <div className="row">
              <div className="th">Contractor</div>
              <div className="td">{props.reportData.contractor}</div>
            </div>

            <div className="row">
              <div className="th">Contract Start</div> <div className="td">{props.reportData.contract_start_date}</div>
              <div className="th">Contract End</div> <div className="td">{props.reportData.contract_end_date}</div>
            </div>
          </div>
        </div>

        <hr />

        <div className="section">
          <div className="section-header" style={{}}>
            REPORT METADATA
          </div>
          <div className="section-body">
            <div className="row">
              <div className="th">Weather</div>
              <div className="td">Rainy</div>
              <div className="th">Conditions</div>
              <div className="td">Slushy</div>
            </div>

            <div className="row">
              <div className="th">From</div>
              <div className="td">10:00</div>
              <div className="th">To</div>
              <div className="td">17:00</div>
            </div>
          </div>
        </div>

        <hr />

      </div>
    </div>
  )
})

export default ContentToPrint