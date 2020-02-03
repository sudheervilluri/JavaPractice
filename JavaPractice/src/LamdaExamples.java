import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

interface AlertDao{
    public UUID addAlert(Date time);
     public Date getAlert(UUID id);
}
class LamdaExamples{
	
}
class AlertService {
    
    
    private final MapAlertDAO storage = new MapAlertDAO();
    
    AlertService(AlertDao alertDao){
        //storage = alertDao;
    }
		
    public UUID raiseAlert() {
        return this.storage.addAlert(new Date());
    }
	
    public Date getAlertTime(UUID id) {
        return this.storage.getAlert(id);
    }	
}

class MapAlertDAO implements AlertDao{
    private final Map<UUID, Date> alerts = new HashMap<UUID, Date>();
	
    public UUID addAlert(Date time) {
    	UUID id = UUID.randomUUID();
        this.alerts.put(id, time);
        return id;
    }
	
    public Date getAlert(UUID id) {
        return this.alerts.get(id);
    }	
}