

public class DependencyInversionPrinciple {
	
public static void main(String[] args) {
	BookingService b = new BookingService("test", new CashPayment());
	b.payment.paymentAmount();
	BookingService b2 = new BookingService("test", new CardPayment());
	b2.payment.paymentAmount();
	
}

}


class CardPayment implements IPayment{

	@Override
	public void paymentAmount() {
		System.out.println("Card payment");
		
	}
	
}

class BookingService{
	IPayment payment;
	String member;
	public BookingService(String memeber,IPayment payment) {
		this.member = memeber;
		this.payment = payment;
	}
	
}