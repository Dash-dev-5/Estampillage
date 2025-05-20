"use client"

import { Row, Col, InputGroup, Form } from "react-bootstrap"
import { Search } from "react-bootstrap-icons"

const SearchFilter = ({ placeholder, value, onChange }) => {
  return (
    <Row>
      <Col>
        <InputGroup>
          <InputGroup.Text>
            <Search />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder={placeholder || "Rechercher..."}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </InputGroup>
      </Col>
    </Row>
  )
}

export default SearchFilter
