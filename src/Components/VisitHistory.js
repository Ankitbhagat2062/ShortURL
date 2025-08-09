import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import './VisitHistory.css'
import MapWithAdvancedMarker from './MyMapComponent';

const VisitHistory = () => {
  const visitHistory = useSelector((state) => state.user.visitHistory);
  const apiKey = process.env.REACT_APP_GOOGLE_MAP_KEY;
  if (!visitHistory || visitHistory.length === 0) {
    return (
      <div className="visit-history">
        <h3>Visit History</h3>
        <p>No visits recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="visit-history">
      <h3>Visit History</h3>
      <div className="visits-list">
        {visitHistory.map((visit, index) => (
          <div key={visit._id || index} className="visit-item">
            <div className="visit-header">
              <h2 className="visit-number">Visit #{visitHistory.length - index}</h2>
              <span className="visit-time">
                {format(new Date(visit.timestamp), 'MMM dd, yyyy - HH:mm')}
              </span>
            </div>
            {visit.location?.lat && visit.location?.lon && (
              <div className='Google-Map'>
                <h3 style={{margin:'0'}}>User Location</h3>
                <MapWithAdvancedMarker lat={visit.location.lat} lng={visit.location.lon} apiKey={apiKey} />
              </div>
            )}

            <div className="visit-details">
              <div className="location-info">
                <strong>Location:</strong> {visit.location?.city || 'Unknown'}, {visit.location?.region || 'Unknown'}, {visit.location?.country || 'Unknown'}
              </div>

              {visit.location?.lat && visit.location?.lon && (
                <div className="coordinates">
                  <strong>Coordinates:</strong> {visit.location.lat.toFixed(4)}, {visit.location.lon.toFixed(4)}
                </div>
              )}

              <div className="ip-info">
                <strong>IP Address:</strong> {visit.ip}
              </div>

              <div className="user-agent">
                <strong>Browser:</strong> {visit.userAgent}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default VisitHistory;
