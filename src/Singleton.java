import java.io.Serializable;

public final class Singleton implements Serializable {

	private static Singleton singleton;
	private Singleton() {
		
	}
	public static Singleton getInstance() {
		if(singleton!=null) {
			return singleton;
		}else {
			singleton = new Singleton();
			return singleton;
		}
	}
	protected Object readResolve() {
		return singleton;
	}
	@Override
	protected Object clone() {
		return singleton;
	}
}
