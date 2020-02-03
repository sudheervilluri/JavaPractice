package CoadingExam;

import java.util.ArrayList;

public class Problem1 {
public static void main(String[] args) {
	int i =10;
	if((i>10?i++:--i) <10) {
		System.out.println("Mac");
	}
	if(i<10) {
		System.out.println("pro");
	}
	
	ArrayList<String> sh = new ArrayList<String>();
	sh.add("a");
	sh.add(1, "c");
	System.out.println(sh.size());
	sh.remove("c");
	sh.remove(1);
	System.out.println(sh.size());
}
}
