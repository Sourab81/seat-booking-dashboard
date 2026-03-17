const fs = require('fs');
const path = require('path');

const content = `import React, { useState } from "react";

const BookingPanel = ({
  onAutoLock,
  onConfirm,
  onRelease,
  selectedCount,
  onRefresh
}) => {
  const [count, setCount] = useState(1);
  const [error, setError] = useState("");

  const handleLock = async () => {
    const num = Number(count);

    if (!Number.isInteger(num) || num <= 0) {
      setError("Please enter a positive number of seats.");
      return;
    }

    setError("");

    try {
      await onAutoLock(num);
    } catch (err) {
      console.error(err);
      setError("Unable to find seats right now. Please try again.");
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 8 }}>
        <input
          type="number"
          min={1}
          step={1}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          style={{ width: 80, marginRight: 8 }}
        />
        <button onClick={handleLock} disabled={Number(count) <= 0}>
          Find Seats
        </button>
        <button onClick={onRefresh} style={{ marginLeft: 8 }}>
          Refresh
        </button>
      </div>

      <div style={{ marginBottom: 8 }}>
        <button onClick={onConfirm} disabled={selectedCount === 0}>
          Confirm Booking ({selectedCount})
        </button>
        <button
          onClick={onRelease}
          disabled={selectedCount === 0}
          style={{ marginLeft: 8 }}
        >
          Release Selection
        </button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default BookingPanel;
`;

fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'src', 'components', 'BookingPanel.js'), content, 'utf8');
console.log('BookingPanel.js overwritten');
