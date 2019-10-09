import React, { Component } from 'react';
import Draggable from 'react-draggable';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  constructor(props) 
  { 
    super(props); 
    this.state = {
      isForm : false,
      isCreatBlock: true,
      selectedIndex: 0,
      startPos: {
        x: 0, y: 0
      },
      endPos: {
        x: 0, y: 0
      },
      blocks: [],
      lines: [],
      minChecked: false,
      freChecked: false,
      burChecked: false,
      ercName: "",
      ercSymbol: "",
      ercDecimal: "",
      ercSupply: "",
      deltaPosition: {
        x: 0, y: 0
      },
      clickPos: {
        x: 0, y: 0
      }
    };
  }


  handleClick = (e) => {
    if (e.type === 'click') {

    } else if (e.type === 'contextmenu') {
      e.preventDefault();
      const { clientX, clientY } = e;
      this.setState({
        isForm: true,
        clickPos: {
          x: clientX - 60,
          y: clientY - 30
        }
      });
    }
  }


  initialState = () => {
    this.setState({
      isCreatBlock: true,
      minChecked: false,
      freChecked: false,
      burChecked: false,
      ercName: "",
      ercSymbol: "",
      ercDecimal: "",
      ercSupply: "",
      deltaPosition: {
        x: 0, y: 0
      },
      isForm: !this.state.isForm
    });
  }

  handleMinCheckClick = () => {
    this.setState({ minChecked: !this.state.minChecked });
  }


  handleFreCheckClick = () => {
    this.setState({ freChecked: !this.state.freChecked });
  }

  handleBurCheckClick = () => {
    this.setState({ burChecked: !this.state.burChecked });
  }

  handleCacelForm = () => {
    this.initialState();
  }

  handleInputChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    });
  }

  handleDrag = (e, ui, index) => {
    let blocks = this.state.blocks
    const {x, y} = blocks[index].deltaPosition;
    const deltaPosition = {
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    };
    blocks[index].deltaPosition = deltaPosition;

    this.setState({
      blocks
    });
  };


  draggableOnMouseDown = (index, e) => {
    const block = this.state.blocks[index];
    if (!block) return;
    if (e.button === 0 ) return;

    this.setState({
      ...this.state,
      ...block,
      isForm: true,
      isCreatBlock: false,
      selectedIndex: index
    });
    
  }

  handleDeployForm = () => {
    const {
      minChecked,
      freChecked,
      burChecked,
      ercName,
      ercSymbol,
      ercDecimal,
      ercSupply,
      deltaPosition,
      clickPos,
      selectedIndex
    } = this.state;

    if (!ercName) return;
    if (!ercSymbol) return;

    let { blocks } = this.state;
    if (this.state.isCreatBlock) {
      this.setState({
        blocks: [...blocks, {
          minChecked,
          freChecked,
          burChecked,
          ercName,
          ercSymbol,
          ercDecimal,
          ercSupply,
          deltaPosition: clickPos
        }]
      })
    } else {
      blocks[selectedIndex] = {
        minChecked,
        freChecked,
        burChecked,
        ercName,
        ercSymbol,
        ercDecimal,
        ercSupply,
        deltaPosition
      };
      this.setState({
        blocks
      });
    }
    this.initialState();
  }

  handleOnMouseDown = (e) => {
    if (this.state.isForm) return;
    const { clientX, clientY } = e;
    this.setState({
      startPos: {
        x: clientX,
        y: clientY
      }
    });
  }

  handleOnMouseUp = (e) => {
    if (this.state.isForm) return;
    const { clientX, clientY } = e;
    this.setState({
      endPos: {
        x: clientX,
        y: clientY
      }
    }, () => {
      const { blocks, startPos, endPos } = this.state;
      let deltaPositions = blocks.map(block => {
        let value = {
          x: block.deltaPosition.x + 60,
          y: block.deltaPosition.y + 30
        }

        return value;
      });

      let start = null;
      let end = null;
      deltaPositions.forEach((position, index) => {
        const { x, y } = position;
        const deltaX = 100;
        const deltaY = 70;
        if (
          startPos.x >= x - deltaX && startPos.x <= x + deltaX &&
          startPos.y >= y - deltaY && startPos.y <= y + deltaY
        ) {
          start = index;
        } else if (
          endPos.x >= x - deltaX && endPos.x <= x + deltaX &&
          endPos.y >= y - deltaY && endPos.y <= y + deltaY
        ) {
          end = index;
        }
      });

      if (start === null || end === null) return;
      let isCheckExists = this.state.lines.filter(line => (line.start === start && line.end === end) ||
      (line.start === end && line.end === start));
      if (isCheckExists.length > 0) return;
      this.setState({
        lines: [...this.state.lines, {
          start,
          end
        }]
      });
    });

  }


  handleDValue = (line) => {
    const { blocks } = this.state;
    const start = {
      x: blocks[line.start].deltaPosition.x + 60,
      y: blocks[line.start].deltaPosition.y + 30,
    };
    const end = {
      x: blocks[line.end].deltaPosition.x + 60,
      y: blocks[line.end].deltaPosition.y + 30,
    };
    const des = Math.pow(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2), 0.5);
    const startCx = start.x < end.x ? start.x + 60 : start.x - 60;
    const startCy = start.y < end.y ? start.y + des/2 : start.y - des/2;
    const endCx = start.x < end.x ? end.x - 60 : end.x + 60;
    const endCy = start.y < end.y ? end.y - des/2 : end.y + des/2;
    return `M${start.x},${start.y} C${startCx},${startCy} ${endCx},${endCy} ${end.x},${end.y}`;
  }

  
  render() {

    const {
      isForm,
      minChecked,
      freChecked,
      burChecked,
      ercName,
      ercSymbol,
      ercDecimal,
      ercSupply,
      blocks,
      lines
    } = this.state;
    
    return (
      <div onContextMenu={(e)=> e.preventDefault()}>
        <div
          className="cavas-board"
          onMouseDown={this.handleOnMouseDown}
          onMouseUp={this.handleOnMouseUp}
          onClick={this.handleClick}
          onContextMenu={this.handleClick}>
        </div>
        
        {!isForm && blocks.map((block, index) => 
          <Draggable
            key={`draggable-${index}`}
            onDrag={(e, ui) => this.handleDrag(e, ui, index)}
            position={block.deltaPosition}
            onMouseDown={(e) => this.draggableOnMouseDown(index, e)}>
            <div className="box">
              <button className="block-btn">{block.ercSymbol}</button>
            </div>
          </Draggable>
        )}

        {!isForm && lines.map((line, index) => 
            <svg key={`path-${index}`} style={{ position: 'fixed', width: '100%', height: '100%', zIndex: -3 }}>
              <path
                d={this.handleDValue(line)}
                fill="none"
                stroke="#fe9833"
                strokeWidth={3}
              />
            </svg>
        )}

        {isForm && (
          <div className="erc-card">
            <div className="card-header">
              <div className="row justify-content-center">
                <h3 className="card-title">{ercName}</h3>
              </div>
            </div>
            <div className="card-body">
              <div className="row col-md-12">
                <div className="form-group col-md-6">
                  <label className="input-label">Name</label>
                  <input type="text" value={ercName} name="ercName" className="form-control" onChange={this.handleInputChange} autoComplete="off"></input>
                </div>
                <div className="form-group col-md-6">
                  <label className="input-label">Symbol</label>
                  <input type="text" value={ercSymbol} name="ercSymbol" className="form-control" onChange={this.handleInputChange} autoComplete="off"></input>
                </div>
              </div>
              <div className="row col-md-12">
                <div className="form-group col-md-6">
                  <label className="input-label">Decimal</label>
                  <input type="text" value={ercDecimal} name="ercDecimal" className="form-control" onChange={this.handleInputChange} autoComplete="off"></input>
                </div>
                <div className="form-group col-md-6">
                  <label className="input-label">Supply</label>
                  <input type="text" value={ercSupply} name="ercSupply" className="form-control" onChange={this.handleInputChange} autoComplete="off"></input>
                </div>
              </div>
              <div className="row col-md-12">
                <label className="advance-label">Advance:</label>
              </div>
              <div className="row col-md-12">
                <div className="form-group col-sm-3">
                  <label className="checkbox">Mintable
                    <input type="checkbox" checked={minChecked} onChange={this.handleMinCheckClick} />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="form-group col-sm-3">
                  <label className="checkbox">Freezable
                    <input type="checkbox" checked={freChecked} onChange={this.handleFreCheckClick} />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="form-group col-sm-3">
                  <label className="checkbox">Burnable
                    <input type="checkbox" checked={burChecked} onChange={this.handleBurCheckClick} />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="card-foot">
              <div className="row justify-content-center">
                <button className="card-btn" onClick={this.handleCacelForm}>Cancel</button>
                <button className="card-btn btn-deploy" onClick={this.handleDeployForm}>Deploy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;