
public class ThreadClass implements Runnable{

	private String value ;
	
	public ThreadClass(String value) {
		this.value = value;
	}
	
	@Override
	public void run() {
		  System.out.println("Fetching data from "+value+" by "+Thread.currentThread().getName());
		  try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} // Reading file
		   System.out.println("Read file successfully: "+value+" by "+Thread.currentThread().getName());
	}

}
