package CoadingExam;

import java.util.HashMap;
import java.util.Map;

public class Problem5 {
	public static void main(String[] args) {
		hascodeExample temp = new hascodeExample();
		temp.setName("Sudheer");
		temp.setType("yes");

		Map<hascodeExample, Integer> nm = new HashMap();
		nm.put(temp, 1);

		temp.setName("Sudheer2");

		nm.forEach((k, v) -> {

			hascodeExample n = k;
			System.out.println(n.getName());
			System.out.println(n.hashCode());
		});
	}
}

class hascodeExample {
	private String name;
	private String type;

	public hascodeExample() {

	}

	public hascodeExample(String name, String type) {
		this.name = name;
		this.type = type;
	}

	@Override
	public int hashCode() {
		int prime = 31;
		int result = 1;

		result = prime * result + ((this.name == null) ? 0 : this.name.hashCode());
		result = prime * result + ((this.type == null) ? 0 : this.type.hashCode());

		result = Math.abs(result);
		System.out.println(result);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		hascodeExample other = (hascodeExample) obj;
		if (this.type != other.type)
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}