import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;

public class DataType {
public static void main(String[] args) throws IOException {
	
//    Thread t = new Thread();
//    t.start();
    
	
    HashMap<Integer,String> employee = new HashMap<>();
    employee.put(100,"Amit");  
    employee.put(101,"Vijay");  
    employee.put(102,"Rahul"); 
  
//    for(Entry<Integer, String>  entry:employee.entrySet()){    
//    	 int key=entry.getKey();  
//    	 System.out.println(key);
//    	 
//    	  }  
    Iterator<Integer> keySetIterator = employee.keySet().iterator();
    while(keySetIterator.hasNext()){ 
    Integer key = keySetIterator.next();
    System.out.println("key: " + key + " value: " + employee.get(key)); 
    }
}

}
