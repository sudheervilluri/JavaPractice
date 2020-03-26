
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ComparableExample implements Serializable {

	public static void main(String[] args) {
		List<Student> list = new ArrayList();
		list.add(new Student("XYZ", 3));
		list.add(new Student("ADSD", 4));
		list.add(new Student("1gH", 1));
		list.add(new Student("BCF", 2));

	    Collections.sort(list);  
		list.forEach((n) -> System.out.println(n.name + " " +n.rollNumber));
		
		Comparator<Student> soarted = new Comparator<Student>() {

			@Override
			public int compare(Student o1, Student o2) {
				return o1.rollNumber - o2.rollNumber;
			}

		};

		Collections.sort(list, soarted);
		list.forEach(n -> System.out.println(n.rollNumber));
	}
}

class Student implements Comparable<Student> {
	String name;
	Integer rollNumber;

	public Student(String name, Integer rollNumber) {
		// TODO Auto-generated constructor stub
		this.name = name;
		this.rollNumber = rollNumber;
	}

	@Override
	public int compareTo(Student au) {
		// TODO Auto-generated method stub
		//return this.name.compareTo(o.name);
		int last = this.name.compareTo(au.name);
		return last == 0 ? this.name.compareTo(au.name) : last;
	}

}