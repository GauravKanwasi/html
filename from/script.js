class InteractiveForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      option: "",
      message: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Name: ${this.state.name}, Email: ${this.state.email}, Option: ${this.state.option}, Message: ${this.state.message}`
    );
  };

  render() {
    return (
      <div className="container">
        <h2>Interactive Form</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={this.state.name}
            onChange={this.handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
          <select
            name="option"
            value={this.state.option}
            onChange={this.handleChange}
            required
          >
            <option value="">Select an option</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
          </select>
          <textarea
            name="message"
            placeholder="Enter your message"
            value={this.state.message}
            onChange={this.handleChange}
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <InteractiveForm />
);
