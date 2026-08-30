function Input({
    label,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false
}) {
    return (
        <div>
            <label>{label}</label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

export default Input;