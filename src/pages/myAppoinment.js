import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import Appointments from "./profileComponents/Appointments";

function Appoinment() {
  return (
    <div className="main_wrap">
      <Container>
        <Row>
          <Col lg={3} md={4}>
            <Sidebar />
          </Col>
          <Col lg={9} md={12}>
            <div className="bg-white p-3 p-md-4 pb-lg-5">
              <div className="profile_heading mb-3">
                <h2>My Appointment</h2>
              </div>
              <Appointments />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Appoinment;
