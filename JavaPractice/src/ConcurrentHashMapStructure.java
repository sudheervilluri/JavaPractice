import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentHashMapStructure {
public static void main(String[] args) {
	ConcurrentHashMap<Country, String> list = new ConcurrentHashMap<>();
	list.put(new Country("india", 1000), "delhi");
	 Country japan=new Country("Japan",10000);
     Country france=new Country("France",2000);
     Country russia=new Country("Russia",20000);
     list.put(japan,"Tokyo");
     list.put(france,"Paris");
     list.put(russia,"Moscow");
	
	Iterator<Country> itr = list.keySet().iterator();
	while(itr.hasNext()) {
		 Country countryObj=(Country) itr.next();
         String capital=list.get(countryObj);
         System.out.println(countryObj.getName()+"----"+capital);
         
       
	}
	for(Map.Entry<Country, String> m : list.entrySet()) {
		
	}
	
}
}
