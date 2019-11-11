
interface test {
	default void fun() {
		System.out.println(" From Interface1 ");
	}
}

interface Test2 {
	default void fun() {
		System.out.println("fRom Interfface 2");
	}
}

public class DiamondInterface implements test, Test2 {

	@Override
	public void fun() {
		// TODO Auto-generated method stub
		test.super.fun();
		Test2.super.fun();
	}
public static void main(String[] args) {
	DiamondInterface d = new DiamondInterface();
	d.fun();
}
}
