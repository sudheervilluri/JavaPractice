package DataStructures;

import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

public class HashSetExample {
public static void main(String[] args) {
	Set<String> h = new HashSet<>();
	  // Adding elements into HashSet usind add() 
    h.add("India"); 
    h.add("Australia"); 
    h.add("South Africa"); 
    h.add("India");// adding duplicate elements
    for (String string : h) {
		System.out.println(h);
	}
    
    h = new TreeSet<>();
    // Adding elements into HashSet usind add() 
    h.add("India"); 
    h.add("Australia"); 
    h.add("South Africa"); 
    h.add("India");// adding duplicate elements
    for (String string : h) {
		System.out.println(h);
	}
    
    
}
}
