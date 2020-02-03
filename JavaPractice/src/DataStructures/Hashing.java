package DataStructures;

public class Hashing {

	public static void main(String[] args) {
		Hashvalue a = new Hashvalue(5);
	
	}
	
}

class Hashvalue{
	int value;
	public Hashvalue(int value) {
		this.value = value;
	}
	
	@Override
	public int hashCode() {
	System.out.println(value);
	return value;

	}
}
