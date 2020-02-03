
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class Comparable implements Serializable{

	public static void main(String[] args) {
		List<Student> list = new ArrayList();
		list.add(new Student("3", 3));
		list.add(new Student("4", 4));
		list.add(new Student("1", 1));
		list.add(new Student("2", 2));
		
		Comparator<Student> soarted = new Comparator<Student>() {

			@Override
			public int compare(Student o1, Student o2) {
				return o1.rollNumber - o2.rollNumber;
			}
			
		};
		
		Collections.sort(list,soarted);
		 list.forEach(n -> System.out.println(n.rollNumber)); 
	}
}
class Student {
	String name;
	Integer rollNumber;
	public Student(String name,Integer rollNumber) {
		// TODO Auto-generated constructor stub
		this.name = name;
		this.rollNumber = rollNumber;
	}
	
}