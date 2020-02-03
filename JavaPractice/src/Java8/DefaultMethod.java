package Java8;

interface Test{
	default int squre(int r) {
		return r*r;
	}
	int area(int g);
}

public class DefaultMethod {

	
	public static void main(String[] args) {
		Test t =new Test() {
			@Override
			public int area(int g) {
				// TODO Auto-generated method stub
				return squre(g);
			}
		};
		
		System.out.println(t.area(5));
	}
}
